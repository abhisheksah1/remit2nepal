import fs from "node:fs/promises";
import path from "node:path";
import type { Request } from "express";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuid } from "uuid";
import { LeaveTrackerUser } from "../models/leave-tracker-user.model.js";
import { Media } from "../models/media.model.js";
import { uploadRoot } from "../config/env.js";
import { LeaveEmployee } from "../models/leave-employee.model.js";
import { LeaveType } from "../models/leave-type.model.js";
import { LeaveRequest } from "../models/leave-request.model.js";
import { AppError, ConflictError, NotFoundError } from "../utils/app-error.js";
import { hashLeavePassword } from "./leave-tracker-auth.service.js";
import { writeAudit } from "./audit.service.js";
import { AUDIT_ACTIONS } from "../constants/audit-actions.js";
import { clientIp, userAgent } from "../utils/request-meta.js";
import { escapeRegex } from "../utils/pagination.js";
import {
  adToBs,
  annualEntitlement,
  bsMonthRange,
  bsYearRange,
  daysInBsMonth,
  eachUtcDay,
  isoDateUtc,
  monthsOfService,
  nepalToday,
  parseIsoUtc,
  BS_MONTH_NAMES_EN,
  BS_MONTH_NAMES_NP
} from "../utils/nepali-calendar.js";

function calendarDays(from: Date, to: Date) {
  const start = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const end = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  return Math.floor((end - start) / 86400000) + 1;
}

export type LeaveDayKind = "PRESENT" | "FULL" | "HALF" | "OVERTIME";
export type AttendanceMark = "P" | "A" | "H" | "O";

function resolveLeaveDays(kind: LeaveDayKind, fromDate: Date, toDate: Date) {
  if (kind === "PRESENT") return 0;
  if (kind === "HALF") return -0.5;
  if (kind === "OVERTIME") return 1;
  return -calendarDays(fromDate, toDate);
}

function markToKind(mark: AttendanceMark): LeaveDayKind {
  if (mark === "P") return "PRESENT";
  if (mark === "H") return "HALF";
  if (mark === "O") return "OVERTIME";
  return "FULL";
}

function defaultReason(kind: LeaveDayKind, custom?: string) {
  const text = custom?.trim();
  if (text) return text;
  if (kind === "PRESENT") return "Present";
  if (kind === "HALF") return "Half leave";
  if (kind === "OVERTIME") return "Overtime";
  return "Full leave";
}

async function defaultLeaveType() {
  await ensureLeaveTypes();
  const item = await LeaveType.findOne({ status: "ACTIVE" }).sort({ name: 1 });
  if (!item) throw new AppError("Add a leave type first", 400);
  return item;
}

export async function listLeaveUsers(page = 1, limit = 20, search?: string) {
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { userId: new RegExp(search, "i") },
      { fullName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") }
    ];
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    LeaveTrackerUser.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    LeaveTrackerUser.countDocuments(filter)
  ]);
  return { items, total, page, limit };
}

export async function createLeaveUser(
  input: { fullName: string; userId: string; password: string; email?: string; status?: "ACTIVE" | "INACTIVE" },
  req: Request
) {
  if (input.password.length < 8) throw new AppError("Password must be at least 8 characters", 400);
  const exists = await LeaveTrackerUser.findOne({ userId: input.userId.toLowerCase() });
  if (exists) throw new ConflictError("User ID already exists");
  const user = await LeaveTrackerUser.create({
    fullName: input.fullName,
    userId: input.userId.toLowerCase(),
    passwordHash: await hashLeavePassword(input.password),
    email: input.email ?? "",
    status: input.status ?? "ACTIVE",
    createdBy: req.user?.id
  });
  await writeAudit({
    action: AUDIT_ACTIONS.CREATE,
    module: "leave_tracker",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: String(user._id),
    newValue: { userId: user.userId, fullName: user.fullName },
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return user;
}

export async function updateLeaveUser(
  id: string,
  input: { fullName?: string; email?: string; status?: "ACTIVE" | "INACTIVE"; password?: string },
  req: Request
) {
  const user = await LeaveTrackerUser.findById(id);
  if (!user) throw new NotFoundError("Leave tracker user not found");
  if (input.fullName) user.fullName = input.fullName;
  if (input.email !== undefined) user.email = input.email;
  if (input.status) user.status = input.status;
  if (input.password) {
    if (input.password.length < 8) throw new AppError("Password must be at least 8 characters", 400);
    user.passwordHash = await hashLeavePassword(input.password);
  }
  await user.save();
  await writeAudit({
    action: AUDIT_ACTIONS.UPDATE,
    module: "leave_tracker",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: id,
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return user;
}

export async function deactivateLeaveUser(id: string, req: Request) {
  const user = await LeaveTrackerUser.findById(id);
  if (!user) throw new NotFoundError("Leave tracker user not found");
  user.status = "INACTIVE";
  await user.save();
  await writeAudit({
    action: AUDIT_ACTIONS.DELETE,
    module: "leave_tracker",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    entityId: id,
    ipAddress: clientIp(req),
    userAgent: userAgent(req)
  });
  return user;
}

export async function ensureLeaveTypes() {
  if ((await LeaveType.countDocuments()) > 0) return;
  await LeaveType.insertMany([
    { name: "Annual", daysAllowed: 14, paid: true, color: "#2E3192", description: "14 days after 6 months of service; 0 for new staff" },
    { name: "Sick", daysAllowed: 12, paid: true, color: "#E31E24", description: "Sick leave with documentation when required" },
    { name: "Casual", daysAllowed: 6, paid: true, color: "#1d4ed8", description: "Short notice personal leave" },
    { name: "Unpaid", daysAllowed: 0, paid: false, color: "#64748b", description: "Leave without pay" }
  ]);
}

async function listResource(Model: typeof LeaveEmployee, page: number, limit: number, search?: string, extra: Record<string, unknown> = {}) {
  const filter: Record<string, unknown> = { ...extra };
  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { employeeId: new RegExp(search, "i") },
      { department: new RegExp(search, "i") }
    ];
  }
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Model.countDocuments(filter)
  ]);
  return { items, total, page, limit };
}

function utcDayStart(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

async function yearBalances(employeeIds: string[], asOf = nepalToday()) {
  const bs = adToBs(asOf);
  const { start, end } = bsYearRange(bs.year);
  const rows = await LeaveRequest.find({
    employee: { $in: employeeIds },
    status: "APPROVED",
    fromDate: { $lte: end },
    toDate: { $gte: start }
  })
    .select("employee days kind")
    .lean();
  const map = new Map<string, { leaveTaken: number; overtime: number }>();
  for (const id of employeeIds) map.set(id, { leaveTaken: 0, overtime: 0 });
  for (const row of rows) {
    const id = String(row.employee);
    const bucket = map.get(id) ?? { leaveTaken: 0, overtime: 0 };
    const days = Number(row.days) || 0;
    if (days > 0) bucket.overtime += days;
    else bucket.leaveTaken += Math.abs(days);
    map.set(id, bucket);
  }
  return { map, bsYear: bs.year };
}

function withBalance<T extends { _id: unknown; joinDate?: Date }>(
  employee: T,
  usage: { leaveTaken: number; overtime: number },
  asOf = nepalToday()
) {
  const joinDate = employee.joinDate ? new Date(employee.joinDate) : undefined;
  const entitlement = annualEntitlement(joinDate, asOf);
  const tenureMonths = joinDate ? monthsOfService(joinDate, asOf) : 0;
  const leaveLeft = Math.round((entitlement + usage.overtime - usage.leaveTaken) * 10) / 10;
  return {
    ...employee,
    tenureMonths,
    eligible: entitlement > 0,
    entitlement,
    leaveTaken: usage.leaveTaken,
    overtime: usage.overtime,
    leaveLeft
  };
}

export async function listEmployees(page = 1, limit = 20, search?: string) {
  const result = await listResource(LeaveEmployee, page, limit, search);
  const ids = result.items.map((row) => String(row._id));
  const { map } = await yearBalances(ids);
  return {
    ...result,
    items: result.items.map((row) => withBalance(row, map.get(String(row._id)) ?? { leaveTaken: 0, overtime: 0 }))
  };
}

export async function createEmployee(input: {
  employeeId: string;
  name: string;
  department: string;
  designation?: string;
  joinDate: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  status?: "ACTIVE" | "INACTIVE";
}) {
  const employeeId = input.employeeId.trim().toUpperCase();
  const exists = await LeaveEmployee.findOne({ employeeId });
  if (exists) throw new ConflictError("Employee ID already exists");
  const joinDate = parseIsoUtc(input.joinDate);
  if (Number.isNaN(joinDate.getTime())) throw new AppError("Enter a valid join date", 400);
  const created = await LeaveEmployee.create({
    employeeId,
    name: input.name.trim(),
    department: input.department.trim(),
    designation: input.designation?.trim() ?? "",
    joinDate,
    email: input.email ?? "",
    phone: input.phone ?? "",
    photoUrl: input.photoUrl?.trim() ?? "",
    status: input.status ?? "ACTIVE"
  });
  return withBalance(created.toObject(), { leaveTaken: 0, overtime: 0 });
}

export async function updateEmployee(id: string, input: Record<string, unknown>) {
  const item = await LeaveEmployee.findById(id);
  if (!item) throw new NotFoundError("Employee not found");
  if (typeof input.employeeId === "string") {
    const employeeId = input.employeeId.trim().toUpperCase();
    const clash = await LeaveEmployee.findOne({ employeeId, _id: { $ne: item._id } });
    if (clash) throw new ConflictError("Employee ID already exists");
    item.employeeId = employeeId;
  }
  if (typeof input.name === "string") item.name = input.name.trim();
  if (typeof input.department === "string") item.department = input.department.trim();
  if (typeof input.designation === "string") item.designation = input.designation.trim();
  if (typeof input.joinDate === "string") {
    const joinDate = parseIsoUtc(input.joinDate);
    if (Number.isNaN(joinDate.getTime())) throw new AppError("Enter a valid join date", 400);
    item.joinDate = joinDate;
  }
  if (typeof input.email === "string") item.email = input.email;
  if (typeof input.phone === "string") item.phone = input.phone;
  if (typeof input.photoUrl === "string") item.photoUrl = input.photoUrl.trim();
  if (input.status === "ACTIVE" || input.status === "INACTIVE") item.status = input.status;
  await item.save();
  const { map } = await yearBalances([String(item._id)]);
  return withBalance(item.toObject(), map.get(String(item._id)) ?? { leaveTaken: 0, overtime: 0 });
}

export async function removeEmployee(id: string) {
  const item = await LeaveEmployee.findById(id);
  if (!item) throw new NotFoundError("Employee not found");
  item.status = "INACTIVE";
  await item.save();
  return item;
}

const EMPLOYEE_PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

export async function storeEmployeePhoto(file: Express.Multer.File) {
  const detected = await fileTypeFromBuffer(file.buffer);
  const extension = detected ? EMPLOYEE_PHOTO_TYPES[detected.mime] : undefined;
  if (!detected || !extension) {
    throw new AppError("Upload a JPG, PNG, or WebP photo", 400);
  }
  const filename = `${uuid()}${extension}`;
  const destDir = path.join(uploadRoot, "employees");
  await fs.mkdir(destDir, { recursive: true });
  await fs.writeFile(path.join(destDir, filename), file.buffer);
  const url = `/uploads/employees/${filename}`;
  await Media.create({
    filename,
    originalName: file.originalname,
    mimeType: detected.mime,
    size: file.size,
    url,
    altText: "Employee photo",
    folder: "employees"
  });
  return { url };
}

export async function listTypes(page = 1, limit = 50, search?: string) {
  await ensureLeaveTypes();
  const filter: Record<string, unknown> = {};
  if (search) filter.name = new RegExp(search, "i");
  const skip = (page - 1) * limit;
  const [items, total, usage] = await Promise.all([
    LeaveType.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    LeaveType.countDocuments(filter),
    LeaveRequest.aggregate<{ _id: unknown; count: number; taken: number }>([
      { $match: { status: { $in: ["APPROVED", "PENDING"] } } },
      {
        $group: {
          _id: "$leaveType",
          count: { $sum: 1 },
          taken: { $sum: { $cond: [{ $lt: ["$days", 0] }, { $abs: "$days" }, 0] } }
        }
      }
    ])
  ]);
  const usageMap = new Map(usage.map((row) => [String(row._id), row]));
  return {
    items: items.map((item) => {
      const stats = usageMap.get(String(item._id));
      return { ...item, usedCount: stats?.count ?? 0, usedDays: stats?.taken ?? 0 };
    }),
    total,
    page,
    limit
  };
}

export async function createType(input: {
  name: string;
  daysAllowed: number;
  paid?: boolean;
  color?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
}) {
  const name = input.name.trim();
  const exists = await LeaveType.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, "i") });
  if (exists) throw new ConflictError("Leave type already exists");
  return LeaveType.create({
    name,
    daysAllowed: input.daysAllowed,
    paid: input.paid ?? true,
    color: input.color || "#2E3192",
    description: input.description ?? "",
    status: input.status ?? "ACTIVE"
  });
}

export async function updateType(id: string, input: Record<string, unknown>) {
  const item = await LeaveType.findById(id);
  if (!item) throw new NotFoundError("Leave type not found");
  if (typeof input.name === "string") item.name = input.name.trim();
  if (typeof input.daysAllowed === "number") item.daysAllowed = input.daysAllowed;
  if (typeof input.paid === "boolean") item.paid = input.paid;
  if (typeof input.color === "string") item.color = input.color;
  if (typeof input.description === "string") item.description = input.description;
  if (input.status === "ACTIVE" || input.status === "INACTIVE") item.status = input.status;
  await item.save();
  return item;
}

export async function removeType(id: string) {
  const item = await LeaveType.findById(id);
  if (!item) throw new NotFoundError("Leave type not found");
  item.status = "INACTIVE";
  await item.save();
  return item;
}

export async function listLeaves(
  page = 1,
  limit = 20,
  search?: string,
  status?: string,
  employee?: string,
  leaveType?: string,
  kind?: string
) {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (leaveType) filter.leaveType = leaveType;
  if (employee) filter.employee = employee;
  if (kind === "LEAVE") filter.kind = { $in: ["FULL", "HALF"] };
  else if (kind === "PRESENT") filter.kind = "PRESENT";
  else if (kind === "OVERTIME") filter.kind = "OVERTIME";
  else if (kind === "FULL" || kind === "HALF" || kind === "PRESENT" || kind === "OVERTIME") filter.kind = kind;
  const skip = (page - 1) * limit;
  if (search && !employee) {
    const people = await LeaveEmployee.find({
      $or: [{ name: new RegExp(search, "i") }, { employeeId: new RegExp(search, "i") }, { department: new RegExp(search, "i") }]
    })
      .select("_id")
      .lean();
    filter.employee = { $in: people.map((row) => String(row._id)) };
  }
  const base = { ...filter };
  delete base.kind;
  const [items, total, pending, approved, present, leaveCount, overtime] = await Promise.all([
    LeaveRequest.find(filter)
      .populate("employee")
      .populate("leaveType")
      .sort({ fromDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    LeaveRequest.countDocuments(filter),
    LeaveRequest.countDocuments({ ...filter, status: "PENDING" }),
    LeaveRequest.countDocuments({ ...filter, status: "APPROVED" }),
    LeaveRequest.countDocuments({ ...base, kind: "PRESENT" }),
    LeaveRequest.countDocuments({ ...base, kind: { $in: ["FULL", "HALF"] } }),
    LeaveRequest.countDocuments({ ...base, kind: "OVERTIME" })
  ]);
  return { items, total, page, limit, pending, approved, present, leaveCount, overtime };
}

export async function createLeave(input: {
  employee: string;
  leaveType?: string;
  span?: "SINGLE" | "RANGE";
  kind?: LeaveDayKind;
  fromDate: string;
  toDate?: string;
  reason?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
}) {
  const employee = await LeaveEmployee.findById(input.employee);
  if (!employee || employee.status !== "ACTIVE") throw new NotFoundError("Employee not found");
  const leaveType = input.leaveType ? await LeaveType.findById(input.leaveType) : await defaultLeaveType();
  if (!leaveType || leaveType.status !== "ACTIVE") throw new NotFoundError("Leave type not found");
  const span = input.span ?? (input.toDate && input.toDate !== input.fromDate ? "RANGE" : "SINGLE");
  const kind: LeaveDayKind = span === "RANGE" ? "FULL" : input.kind ?? "FULL";
  const fromDate = utcDayStart(parseIsoUtc(input.fromDate));
  const toDate = utcDayStart(parseIsoUtc(span === "RANGE" ? input.toDate || input.fromDate : input.fromDate));
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) throw new AppError("Enter valid dates", 400);
  if (toDate < fromDate) throw new AppError("End date cannot be before start date", 400);
  return LeaveRequest.create({
    employee: employee._id,
    leaveType: leaveType._id,
    span,
    kind,
    fromDate,
    toDate,
    days: resolveLeaveDays(kind, fromDate, toDate),
    reason: defaultReason(kind, input.reason),
    status: input.status ?? "APPROVED"
  });
}

export async function markAttendance(input: {
  employee: string;
  dates?: string[];
  mark?: AttendanceMark;
  days?: Array<{ date: string; mark: AttendanceMark }>;
  reason?: string;
}) {
  const employee = await LeaveEmployee.findById(input.employee);
  if (!employee || employee.status !== "ACTIVE") throw new NotFoundError("Employee not found");
  const leaveType = await defaultLeaveType();
  const entries =
    input.days && input.days.length
      ? input.days
      : (input.dates ?? []).map((date) => ({ date, mark: input.mark as AttendanceMark }));
  const created = [];
  for (const entry of entries) {
    const iso = entry.date.slice(0, 10);
    const day = utcDayStart(parseIsoUtc(iso));
    if (Number.isNaN(day.getTime())) throw new AppError("Enter valid dates", 400);
    const kind = markToKind(entry.mark);
    await LeaveRequest.deleteMany({
      employee: employee._id,
      status: { $in: ["APPROVED", "PENDING"] },
      fromDate: { $lte: day },
      toDate: { $gte: day }
    });
    created.push(
      await LeaveRequest.create({
        employee: employee._id,
        leaveType: leaveType._id,
        span: "SINGLE",
        kind,
        fromDate: day,
        toDate: day,
        days: resolveLeaveDays(kind, day, day),
        reason: defaultReason(kind, input.reason),
        status: "APPROVED"
      })
    );
  }
  return { count: created.length, items: created };
}

export async function updateLeave(
  id: string,
  input: Partial<{
    employee: string;
    leaveType: string;
    span: "SINGLE" | "RANGE";
    kind: LeaveDayKind;
    fromDate: string;
    toDate: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    reviewNote: string;
  }>
) {
  const item = await LeaveRequest.findById(id);
  if (!item) throw new NotFoundError("Leave request not found");
  if (input.employee) item.employee = input.employee as never;
  if (input.leaveType) item.leaveType = input.leaveType as never;
  if (input.span) item.span = input.span;
  if (input.kind) item.kind = input.kind;
  if (input.fromDate) item.fromDate = utcDayStart(parseIsoUtc(input.fromDate));
  const span = item.span === "RANGE" ? "RANGE" : "SINGLE";
  const kind: LeaveDayKind = span === "RANGE" ? "FULL" : ((item.kind as LeaveDayKind) || "FULL");
  item.kind = kind;
  if (kind === "HALF" || kind === "OVERTIME" || span === "SINGLE") {
    item.toDate = item.fromDate;
    item.span = "SINGLE";
  } else if (input.toDate) {
    item.toDate = utcDayStart(parseIsoUtc(input.toDate));
  }
  if (item.toDate < item.fromDate) throw new AppError("End date cannot be before start date", 400);
  item.days = resolveLeaveDays(kind, item.fromDate, item.toDate);
  if (typeof input.reason === "string") item.reason = input.reason.trim();
  if (input.status) item.status = input.status;
  if (typeof input.reviewNote === "string") item.reviewNote = input.reviewNote;
  await item.save();
  return LeaveRequest.findById(id).populate("employee").populate("leaveType");
}

export async function removeLeave(id: string) {
  const item = await LeaveRequest.findById(id);
  if (!item) throw new NotFoundError("Leave request not found");
  item.status = "CANCELLED";
  await item.save();
  return item;
}

export async function dashboard() {
  await ensureLeaveTypes();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);
  const [
    employees,
    pending,
    approvedMonth,
    onLeaveToday,
    types,
    recent,
    departments
  ] = await Promise.all([
    LeaveEmployee.countDocuments({ status: "ACTIVE" }),
    LeaveRequest.countDocuments({ status: "PENDING" }),
    LeaveRequest.countDocuments({ status: "APPROVED", fromDate: { $gte: monthStart } }),
    LeaveRequest.countDocuments({
      status: "APPROVED",
      kind: { $in: ["FULL", "HALF"] },
      fromDate: { $lte: start },
      toDate: { $gte: start }
    }),
    LeaveType.countDocuments({ status: "ACTIVE" }),
    LeaveRequest.find()
      .populate("employee")
      .populate("leaveType")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    LeaveEmployee.aggregate<{ _id: string; count: number }>([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ])
  ]);
  const staff = await LeaveEmployee.find({ status: "ACTIVE" }).select("joinDate").lean();
  const { map, bsYear } = await yearBalances(staff.map((row) => String(row._id)));
  const profiles = staff.map((row) => withBalance(row, map.get(String(row._id)) ?? { leaveTaken: 0, overtime: 0 }));
  const today = adToBs(nepalToday());
  return {
    employees,
    pending,
    approvedMonth,
    onLeaveToday,
    types,
    recent,
    departments: departments.map((row) => ({ department: row._id, count: row.count })),
    eligible: profiles.filter((row) => row.eligible).length,
    newStaff: profiles.filter((row) => !row.eligible).length,
    leaveLeft: Math.round(profiles.reduce((sum, row) => sum + row.leaveLeft, 0) * 10) / 10,
    bsYear,
    todayBs: today
  };
}

export type MonthCellMark = "P" | "A" | "H" | "OT" | "W" | "";

export async function monthRegister(bsYear?: number, bsMonth?: number, search?: string) {
  const todayBs = adToBs(nepalToday());
  const year = bsYear || todayBs.year;
  const month = bsMonth || todayBs.month;
  const { start, end } = bsMonthRange(year, month);
  const employeeFilter: Record<string, unknown> = { status: "ACTIVE" };
  if (search) {
    employeeFilter.$or = [
      { name: new RegExp(search, "i") },
      { employeeId: new RegExp(search, "i") },
      { department: new RegExp(search, "i") }
    ];
  }
  const employees = await LeaveEmployee.find(employeeFilter).sort({ name: 1 }).lean();
  const ids = employees.map((row) => String(row._id));
  const [leaves, { map: balances }] = await Promise.all([
    LeaveRequest.find({
      employee: { $in: ids },
      status: "APPROVED",
      fromDate: { $lte: end },
      toDate: { $gte: start }
    })
      .select("employee kind fromDate toDate")
      .lean(),
    yearBalances(ids)
  ]);
  const days = eachUtcDay(start, end).map((date) => {
    const bs = adToBs(date);
    const weekday = date.getUTCDay();
    return {
      day: bs.day,
      iso: isoDateUtc(date),
      weekday,
      weekend: weekday === 6
    };
  });
  const rows = employees.map((employee) => {
    const empLeaves = leaves.filter((row) => String(row.employee) === String(employee._id));
    let present = 0;
    let absent = 0;
    const cells: Array<{ day: number; iso: string; mark: MonthCellMark }> = days.map((day) => {
      const hit = empLeaves.find((row) => utcDayStart(row.fromDate) <= parseIsoUtc(day.iso) && utcDayStart(row.toDate) >= parseIsoUtc(day.iso));
      let mark: MonthCellMark = "";
      if (hit?.kind === "PRESENT") mark = "P";
      else if (hit?.kind === "HALF") mark = "H";
      else if (hit?.kind === "OVERTIME") mark = "OT";
      else if (hit) mark = "A";
      if (mark === "P") present += 1;
      if (mark === "OT") present += 1;
      if (mark === "A") absent += 1;
      if (mark === "H") {
        absent += 0.5;
        present += 0.5;
      }
      return { day: day.day, iso: day.iso, mark };
    });
    const usage = balances.get(String(employee._id)) ?? { leaveTaken: 0, overtime: 0 };
    const profile = withBalance(employee, usage);
    return {
      ...profile,
      present,
      absent,
      cells
    };
  });
  return {
    bsYear: year,
    bsMonth: month,
    monthName: BS_MONTH_NAMES_EN[month - 1],
    monthNameNp: BS_MONTH_NAMES_NP[month - 1],
    daysInMonth: daysInBsMonth(year, month),
    days,
    employees: rows,
    totals: {
      employees: rows.length,
      present: rows.reduce((sum, row) => sum + row.present, 0),
      absent: rows.reduce((sum, row) => sum + row.absent, 0),
      leaveLeft: rows.reduce((sum, row) => sum + row.leaveLeft, 0)
    }
  };
}

export type ReportCellMark = "P" | "A" | "H" | "O" | "";

function reportMark(
  leaves: Array<{ kind?: string; fromDate: Date; toDate: Date }>,
  iso: string
): ReportCellMark {
  const day = parseIsoUtc(iso);
  const hits = leaves.filter((row) => utcDayStart(row.fromDate) <= day && utcDayStart(row.toDate) >= day);
  if (hits.some((row) => row.kind === "FULL")) return "A";
  if (hits.some((row) => row.kind === "HALF")) return "H";
  if (hits.some((row) => row.kind === "OVERTIME")) return "O";
  if (hits.some((row) => row.kind === "PRESENT")) return "P";
  return "";
}

export async function attendanceReport(bsYear?: number, bsMonth?: number, search?: string) {
  const todayBs = adToBs(nepalToday());
  const year = bsYear || todayBs.year;
  const month = bsMonth || todayBs.month;
  const { start, end } = bsMonthRange(year, month);
  const employeeFilter: Record<string, unknown> = { status: "ACTIVE" };
  if (search) {
    employeeFilter.$or = [
      { name: new RegExp(search, "i") },
      { employeeId: new RegExp(search, "i") },
      { department: new RegExp(search, "i") }
    ];
  }
  const employees = await LeaveEmployee.find(employeeFilter).sort({ name: 1 }).lean();
  const ids = employees.map((row) => String(row._id));
  const [leaves, { map: balances }] = await Promise.all([
    LeaveRequest.find({
      employee: { $in: ids },
      status: "APPROVED",
      fromDate: { $lte: end },
      toDate: { $gte: start }
    })
      .select("employee kind fromDate toDate")
      .lean(),
    yearBalances(ids)
  ]);
  const days = eachUtcDay(start, end).map((date) => {
    const bs = adToBs(date);
    return { day: bs.day, iso: isoDateUtc(date), weekday: date.getUTCDay() };
  });
  const rows = employees.map((employee) => {
    const empLeaves = leaves.filter((row) => String(row.employee) === String(employee._id));
    let present = 0;
    let absent = 0;
    let overtime = 0;
    const cells = days.map((day) => {
      const mark = reportMark(empLeaves, day.iso);
      if (mark === "P") present += 1;
      if (mark === "A") absent += 1;
      if (mark === "H") {
        present += 0.5;
        absent += 0.5;
      }
      if (mark === "O") overtime += 1;
      return { day: day.day, iso: day.iso, mark };
    });
    const usage = balances.get(String(employee._id)) ?? { leaveTaken: 0, overtime: 0 };
    const profile = withBalance(employee, usage);
    return {
      ...profile,
      present,
      absent,
      overtime,
      leaveInYear: profile.entitlement,
      balance: profile.leaveLeft,
      cells
    };
  });
  return {
    bsYear: year,
    bsMonth: month,
    monthName: BS_MONTH_NAMES_EN[month - 1],
    monthNameNp: BS_MONTH_NAMES_NP[month - 1],
    daysInMonth: daysInBsMonth(year, month),
    days,
    employees: rows,
    totals: {
      employees: rows.length,
      present: rows.reduce((sum, row) => sum + row.present, 0),
      absent: rows.reduce((sum, row) => sum + row.absent, 0),
      overtime: rows.reduce((sum, row) => sum + row.overtime, 0),
      leaveLeft: rows.reduce((sum, row) => sum + row.balance, 0)
    }
  };
}
