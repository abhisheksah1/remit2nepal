import * as XLSX from "xlsx";
import { Branch } from "../models/branch.model.js";
import { AppError } from "../utils/app-error.js";
import { makeAgentCode } from "../utils/branch-code.js";
import { resolveProvince, titleCasePlace } from "../constants/nepal-districts.js";
import { writeAudit } from "./audit.service.js";
import type { Request } from "express";

export interface ImportRowError {
  row: number;
  message: string;
}

export interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: ImportRowError[];
}

const HEADER_ALIASES: Record<string, "name" | "district" | "address" | "province" | "phone" | "code"> = {
  "agent name": "name",
  agent: "name",
  name: "name",
  "branch name": "name",
  "agent/branch name": "name",
  district: "district",
  address: "address",
  location: "address",
  province: "province",
  phone: "phone",
  mobile: "phone",
  "branch code": "code",
  code: "code"
};

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function cell(value: unknown): string {
  return String(value ?? "").trim();
}

function isExcelBuffer(file: Express.Multer.File): boolean {
  const name = file.originalname.toLowerCase();
  if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) return false;
  if (file.buffer.length < 4) return false;
  const xlsx = file.buffer[0] === 0x50 && file.buffer[1] === 0x4b;
  const xls = file.buffer[0] === 0xd0 && file.buffer[1] === 0xcf;
  return xlsx || xls || name.endsWith(".xlsx");
}

export function buildBranchTemplate(): Buffer {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([
    ["Agent Name", "District", "Address"],
    ["Kathmandu Central Agent", "Kathmandu", "New Baneshwor, Kathmandu"],
    ["Pokhara Lakeside Agent", "Kaski", "Lakeside Road, Pokhara"],
    ["Biratnagar Main Agent", "Morang", "Main Road, Biratnagar"]
  ]);
  sheet["!cols"] = [{ wch: 32 }, { wch: 18 }, { wch: 44 }];
  XLSX.utils.book_append_sheet(workbook, sheet, "Agents");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

export async function importBranchesFromExcel(file: Express.Multer.File, req: Request): Promise<ImportResult> {
  if (!isExcelBuffer(file)) {
    throw new AppError("Upload an .xlsx Excel file using the provided template", 400);
  }

  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new AppError("The Excel file has no worksheets", 400);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new AppError("The Excel worksheet could not be read", 400);

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false });
  if (rows.length < 2) {
    throw new AppError("The Excel file must include a header row and at least one agent", 400);
  }

  const headerRow = (rows[0] ?? []).map(normalizeHeader);
  const index: Partial<Record<"name" | "district" | "address" | "province" | "phone" | "code", number>> = {};
  headerRow.forEach((header, column) => {
    const mapped = HEADER_ALIASES[header];
    if (mapped && index[mapped] === undefined) index[mapped] = column;
  });

  if (index.name === undefined || index.district === undefined || index.address === undefined) {
    throw new AppError("Excel must include columns: Agent Name, District, Address", 400);
  }

  const result: ImportResult = { created: 0, updated: 0, skipped: 0, errors: [] };
  const usedCodes = new Set((await Branch.find({}, "branchCode").lean()).map((item) => item.branchCode));

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] ?? [];
    const name = cell(row[index.name]);
    const districtRaw = cell(row[index.district]);
    const address = cell(row[index.address]);
    const provinceRaw = index.province !== undefined ? cell(row[index.province]) : "";
    const phone = index.phone !== undefined ? cell(row[index.phone]) : "";
    const givenCode = index.code !== undefined ? cell(row[index.code]) : "";
    const excelRow = i + 1;

    if (!name && !districtRaw && !address) {
      result.skipped += 1;
      continue;
    }
    if (name.length < 2 || districtRaw.length < 2 || address.length < 4) {
      result.errors.push({
        row: excelRow,
        message: "Agent Name, District and Address are required"
      });
      continue;
    }

    const district = titleCasePlace(districtRaw);
    const province = resolveProvince(districtRaw, provinceRaw);
    const existing = await Branch.findOne({
      name: new RegExp(`^${escapeRegex(name)}$`, "i"),
      district: new RegExp(`^${escapeRegex(district)}$`, "i")
    });

    if (existing) {
      existing.address = address;
      existing.province = province;
      existing.district = district;
      if (phone) existing.phone = phone;
      existing.status = "ACTIVE";
      await existing.save();
      result.updated += 1;
      continue;
    }

    let code = (givenCode || makeAgentCode(name, district)).toUpperCase();
    let attempt = 1;
    while (usedCodes.has(code)) {
      code = makeAgentCode(name, district, attempt);
      attempt += 1;
    }
    usedCodes.add(code);

    await Branch.create({
      name,
      branchCode: code,
      province,
      district,
      city: district,
      address,
      phone,
      status: "ACTIVE",
      displayOrder: 100
    });
    result.created += 1;
  }

  await writeAudit({
    action: "CREATE",
    module: "branches",
    userId: req.user?.userId,
    userName: req.user?.fullName,
    newValue: { created: result.created, updated: result.updated, skipped: result.skipped, errors: result.errors.length }
  });

  return result;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
