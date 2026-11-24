import type { EntityId, Paginated, StatusFlag } from "./api";

export interface LeaveUser {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  mustChangePassword?: boolean;
}

export interface LeaveAuthPayload {
  user: LeaveUser;
  rememberMe?: boolean;
}

export interface LeaveTrackerAccount extends EntityId {
  fullName: string;
  userId: string;
  email?: string;
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
  lastLoginAt?: string | null;
}

export interface LeaveEmployee extends EntityId {
  employeeId: string;
  name: string;
  department: string;
  designation?: string;
  joinDate?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  status: StatusFlag;
  tenureMonths?: number;
  eligible?: boolean;
  entitlement?: number;
  leaveTaken?: number;
  overtime?: number;
  leaveLeft?: number;
}

export interface LeaveType extends EntityId {
  name: string;
  daysAllowed: number;
  paid: boolean;
  color: string;
  description?: string;
  status: StatusFlag;
  usedCount?: number;
  usedDays?: number;
}

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type LeaveDayKind = "PRESENT" | "FULL" | "HALF" | "OVERTIME";
export type LeaveSpan = "SINGLE" | "RANGE";
export type MonthCellMark = "P" | "A" | "H" | "OT" | "W" | "";
export type ReportCellMark = "P" | "A" | "H" | "O" | "";
export type AttendanceMark = "P" | "A" | "H" | "O";

export interface LeaveRecord extends EntityId {
  employee: LeaveEmployee | string;
  leaveType: LeaveType | string;
  span?: LeaveSpan;
  kind?: LeaveDayKind;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  reviewNote?: string;
}

export function signedLeaveDays(row: Pick<LeaveRecord, "days" | "kind">) {
  if (row.kind === "PRESENT") return 0;
  if (row.kind === "OVERTIME") return Math.abs(row.days);
  if (row.kind === "HALF") return -Math.abs(row.days);
  if ((!row.kind || row.kind === "FULL") && row.days > 0) return -row.days;
  return row.days;
}

export function formatLeaveDays(days: number) {
  return days > 0 ? `+${days}` : String(days);
}

export function leaveKindLabel(kind?: LeaveDayKind) {
  if (kind === "PRESENT") return "Present";
  if (kind === "HALF") return "Half leave";
  if (kind === "OVERTIME") return "Overtime";
  return "Full leave";
}

export interface LeaveDashboard {
  employees: number;
  pending: number;
  approvedMonth: number;
  onLeaveToday: number;
  types: number;
  recent: LeaveRecord[];
  departments: Array<{ department: string; count: number }>;
  eligible?: number;
  newStaff?: number;
  leaveLeft?: number;
  bsYear?: number;
  todayBs?: { year: number; month: number; day: number };
}

export interface MonthRegisterDay {
  day: number;
  iso: string;
  weekday: number;
  weekend: boolean;
}

export interface MonthRegisterRow extends LeaveEmployee {
  present: number;
  absent: number;
  cells: Array<{ day: number; iso: string; mark: MonthCellMark }>;
}

export interface MonthRegister {
  bsYear: number;
  bsMonth: number;
  monthName: string;
  monthNameNp: string;
  daysInMonth: number;
  days: MonthRegisterDay[];
  employees: MonthRegisterRow[];
  totals: { employees: number; present: number; absent: number; leaveLeft: number };
}

export interface AttendanceReportRow extends LeaveEmployee {
  present: number;
  absent: number;
  overtime: number;
  leaveInYear: number;
  balance: number;
  cells: Array<{ day: number; iso: string; mark: ReportCellMark }>;
}

export interface AttendanceReport {
  bsYear: number;
  bsMonth: number;
  monthName: string;
  monthNameNp: string;
  daysInMonth: number;
  days: Array<{ day: number; iso: string; weekday: number }>;
  employees: AttendanceReportRow[];
  totals: { employees: number; present: number; absent: number; overtime: number; leaveLeft: number };
}

export type LeaveList<T> = Paginated<T> & {
  pending?: number;
  approved?: number;
  present?: number;
  leaveCount?: number;
  overtime?: number;
};
