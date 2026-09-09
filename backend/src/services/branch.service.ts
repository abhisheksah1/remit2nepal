import { Branch } from "../models/branch.model.js";
import { createResourceService } from "./resource.service.js";
import { escapeRegex } from "../utils/pagination.js";

export const branchCatalog = createResourceService(Branch, {
  module: "branches",
  searchFields: ["name", "city", "district", "province", "branchCode", "address"]
});

export async function searchBranches(params: {
  q?: string;
  province?: string;
  district?: string;
  city?: string;
  page?: number;
  limit?: number;
}) {
  const filter: Record<string, unknown> = { status: "ACTIVE" };
  if (params.province) filter.province = params.province;
  if (params.district) filter.district = params.district;
  if (params.city) filter.city = new RegExp(escapeRegex(params.city), "i");
  if (params.q) {
    filter.$or = [
      { name: new RegExp(escapeRegex(params.q), "i") },
      { city: new RegExp(escapeRegex(params.q), "i") },
      { district: new RegExp(escapeRegex(params.q), "i") },
      { address: new RegExp(escapeRegex(params.q), "i") }
    ];
  }
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const limit = Math.min(5000, Math.max(1, Number(params.limit ?? 5000) || 5000));
  const [items, total] = await Promise.all([
    Branch.find(filter).sort({ displayOrder: 1, name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Branch.countDocuments(filter)
  ]);
  return { items, total, page, limit };
}

export async function branchFilterMeta() {
  const items = await Branch.find({ status: "ACTIVE" }).select("province district").lean();
  const provinces = Array.from(new Set(items.map((item) => item.province).filter(Boolean))).sort();
  const districts = Array.from(
    new Map(
      items
        .filter((item) => item.district)
        .map((item) => [`${item.province}|${item.district}`, { province: item.province, district: item.district }])
    ).values()
  ).sort((a, b) => a.district.localeCompare(b.district));
  return { provinces, districts, total: items.length };
}
