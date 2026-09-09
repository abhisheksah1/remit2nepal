import * as XLSX from "xlsx";
import { Branch } from "../models/branch.model.js";
import { AppError } from "../utils/app-error.js";
import { makeAgentCode } from "../utils/branch-code.js";
import { findDistrictInText, officialDistrictName, resolveProvince, titleCasePlace } from "../constants/nepal-districts.js";
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

type ColKey = "name" | "district" | "address" | "province" | "phone" | "code" | "municipality";
type ColIndex = Partial<Record<ColKey, number>>;

const HEADER_ALIASES: Record<string, ColKey> = {
  "agent name": "name",
  "name of agent": "name",
  "name of the agent": "name",
  "एजेन्टको नाम": "name",
  "एजेन्ट नाम": "name",
  agent: "name",
  name: "name",
  नाम: "name",
  "branch name": "name",
  "agent/branch name": "name",
  "agent branch name": "name",
  "outlet name": "name",
  outlet: "name",
  branch: "name",
  district: "district",
  "district name": "district",
  जिल्ला: "district",
  dist: "district",
  "dist.": "district",
  address: "address",
  "full address": "address",
  "agent address": "address",
  "address of agent": "address",
  "district / address": "address",
  "district/address": "address",
  "district and address": "address",
  ठेगाना: "address",
  location: "address",
  place: "address",
  area: "address",
  tole: "address",
  street: "address",
  remarks: "address",
  details: "address",
  province: "province",
  प्रदेश: "province",
  state: "province",
  phone: "phone",
  mobile: "phone",
  "mobile no": "phone",
  "phone no": "phone",
  "contact no": "phone",
  contact: "phone",
  "branch code": "code",
  code: "code",
  municipality: "municipality",
  "vdc/municipality": "municipality",
  vdc: "municipality",
  city: "municipality"
};

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[*#:]+/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function cell(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isSupportedWorkbook(file: Express.Multer.File): boolean {
  const name = file.originalname.toLowerCase();
  if (name.endsWith(".csv") || name.endsWith(".xlsx") || name.endsWith(".xls")) return true;
  if (file.buffer.length < 4) return false;
  const xlsx = file.buffer[0] === 0x50 && file.buffer[1] === 0x4b;
  const xls = file.buffer[0] === 0xd0 && file.buffer[1] === 0xcf;
  return xlsx || xls;
}

function inferHeader(header: string): ColKey | undefined {
  if (header.includes("email")) return undefined;
  if (header.includes("address") || header.includes("location") || header.includes("ठेगाना")) return "address";
  if (header.includes("district") || header.includes("जिल्ला") || header === "dist") return "district";
  if (header.includes("province") || header.includes("प्रदेश")) return "province";
  if (header.includes("phone") || header.includes("mobile") || header.includes("contact")) return "phone";
  if ((header.includes("agent") || header.includes("branch") || header.includes("outlet") || header.includes("एजेन्ट")) && header.includes("name")) {
    return "name";
  }
  if (header === "नाम" || header === "name") return "name";
  if (header.includes("municipality") || header.includes("vdc")) return "municipality";
  if (header === "place" || header === "area") return "address";
  return undefined;
}

function mapHeaders(row: unknown[]): ColIndex {
  const index: ColIndex = {};
  row.forEach((value, column) => {
    const header = normalizeHeader(value);
    if (!header) return;
    const mapped = HEADER_ALIASES[header] ?? inferHeader(header);
    if (mapped && index[mapped] === undefined) index[mapped] = column;
  });
  return index;
}

function mappedCount(index: ColIndex): number {
  return Object.keys(index).length;
}

function findTable(rows: unknown[][]): { headerIndex: number; index: ColIndex } | null {
  let best: { headerIndex: number; index: ColIndex } | null = null;
  let bestScore = 0;
  const scan = Math.min(rows.length, 50);
  for (let i = 0; i < scan; i += 1) {
    const index = mapHeaders(rows[i] ?? []);
    if (index.name === undefined) continue;
    const score = mappedCount(index);
    if (score > bestScore) {
      best = { headerIndex: i, index };
      bestScore = score;
    }
  }
  return best;
}

function isPhoneLike(value: string): boolean {
  return /^\+?[\d\s().-]{7,}$/.test(value);
}

function isSerialLike(value: string): boolean {
  return /^\d{1,5}$/.test(value);
}

function leftoverLocation(row: unknown[], index: ColIndex, name: string): string {
  const used = new Set(Object.values(index).filter((column): column is number => typeof column === "number"));
  const extras: string[] = [];
  row.forEach((value, column) => {
    if (used.has(column)) return;
    const text = cell(value);
    if (!text || text === name || isSerialLike(text) || isPhoneLike(text)) return;
    extras.push(text);
  });
  return extras.join(", ");
}

function knownDistrict(value: string): string {
  return officialDistrictName(value) || findDistrictInText(value);
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
  if (!isSupportedWorkbook(file)) {
    throw new AppError("Upload an .xlsx or .csv file with Agent Name, District and Address columns", 400);
  }

  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(file.buffer, { type: "buffer" });
  } catch {
    throw new AppError("The file could not be read. Upload an .xlsx or .csv exported from Excel.", 400);
  }
  if (!workbook.SheetNames.length) {
    throw new AppError("The Excel file has no worksheets", 400);
  }

  const tables: Array<{ rows: unknown[][]; headerIndex: number; index: ColIndex; sheetName: string }> = [];
  let lastHeaders: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false, blankrows: false });
    if (!rows.length) continue;
    lastHeaders = (rows[0] ?? []).map((value) => cell(value)).filter(Boolean);
    const found = findTable(rows);
    if (found) tables.push({ rows, ...found, sheetName });
  }

  if (!tables.length) {
    const found = lastHeaders.length ? ` Found columns: ${lastHeaders.join(", ")}.` : "";
    throw new AppError(
      `Excel must include an Agent Name column.${found} District and Address are used when present.`,
      400
    );
  }

  const result: ImportResult = { created: 0, updated: 0, skipped: 0, errors: [] };
  const existing = await Branch.find({}, "name district branchCode address phone municipality province status").lean();
  const usedCodes = new Set(existing.map((item) => item.branchCode));
  const byKey = new Map(
    existing.map((item) => [`${item.name.toLowerCase()}|${item.district.toLowerCase()}`, item])
  );

  const inserts: Record<string, unknown>[] = [];
  const updates: Array<{ id: unknown; set: Record<string, unknown> }> = [];

  for (const table of tables) {
    const sheetDistrict = knownDistrict(table.sheetName);
    for (let i = table.headerIndex + 1; i < table.rows.length; i += 1) {
      const row = table.rows[i] ?? [];
      const name = cell(row[table.index.name ?? -1]);
      const districtRaw = table.index.district !== undefined ? cell(row[table.index.district]) : "";
      const municipality = table.index.municipality !== undefined ? cell(row[table.index.municipality]) : "";
      const addressRaw = table.index.address !== undefined ? cell(row[table.index.address]) : "";
      const provinceRaw = table.index.province !== undefined ? cell(row[table.index.province]) : "";
      const phone = table.index.phone !== undefined ? cell(row[table.index.phone]) : "";
      const givenCode = table.index.code !== undefined ? cell(row[table.index.code]) : "";
      const extra = leftoverLocation(row, table.index, name);
      const excelRow = i + 1;

      if (!name && !districtRaw && !addressRaw && !municipality && !extra) {
        result.skipped += 1;
        continue;
      }
      if (name.length < 2) {
        result.errors.push({ row: excelRow, message: "Agent Name is required" });
        continue;
      }

      const district =
        knownDistrict(districtRaw) ||
        findDistrictInText(addressRaw, municipality, extra, name, table.sheetName) ||
        sheetDistrict ||
        (districtRaw ? titleCasePlace(districtRaw) : "Other");

      const address =
        [addressRaw, municipality, extra].filter(Boolean).join(", ") ||
        districtRaw ||
        name;

      const province = resolveProvince(district, provinceRaw);
      const key = `${name.toLowerCase()}|${district.toLowerCase()}`;
      const current = byKey.get(key);

      if (current) {
        updates.push({
          id: current._id,
          set: {
            address,
            province,
            district,
            ...(municipality ? { municipality } : {}),
            ...(phone ? { phone } : {}),
            status: "ACTIVE"
          }
        });
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

      const doc = {
        name,
        branchCode: code,
        province,
        district,
        municipality,
        city: district,
        address,
        phone,
        status: "ACTIVE",
        displayOrder: 100
      };
      inserts.push(doc);
      byKey.set(key, { ...doc, _id: code } as never);
      result.created += 1;
    }
  }

  if (!inserts.length && !updates.length) {
    throw new AppError("No agent rows were found under the header. Add at least an Agent Name column.", 400);
  }

  const ops = [
    ...updates.map((item) => ({
      updateOne: { filter: { _id: item.id }, update: { $set: item.set } }
    })),
    ...inserts.map((document) => ({ insertOne: { document } }))
  ];

  if (ops.length) {
    await Branch.bulkWrite(ops, { ordered: false });
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
