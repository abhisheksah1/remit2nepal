import { Service } from "../models/service.model.js";
import { createResourceService } from "./resource.service.js";
import { toSlug } from "../utils/slug.js";

export const serviceCatalog = createResourceService(Service, {
  module: "services",
  searchFields: ["title", "shortDescription"],
  richTextFields: ["fullDescription"]
});

export async function createService(input: Record<string, unknown>, req?: Parameters<typeof serviceCatalog.create>[1]) {
  const slug = typeof input.slug === "string" && input.slug ? input.slug : toSlug(String(input.title ?? ""));
  return serviceCatalog.create({ ...input, slug }, req);
}
