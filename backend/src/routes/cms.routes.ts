import { Router } from "express";
import * as cms from "../controllers/cms.controller.js";
import * as branchImport from "../controllers/branch-import.controller.js";
import { crudRouter } from "./crud.router.js";
import {
  branchSchema,
  documentSchema,
  faqSchema,
  gallerySchema,
  navigationSchema,
  newsSchema,
  pageSchema,
  partnerSchema,
  sectionSchema,
  serviceChargePageSchema,
  remittanceSchema,
  serviceChargeRowSchema,
  serviceSchema,
  socialSchema,
  teamSchema
} from "../validators/cms.validator.js";
import { requirePermission } from "../middlewares/rbac.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { partnershipAdmin } from "../controllers/partnership.controller.js";
import { partnerApplicationUpdateSchema, partnershipSettingsSchema } from "../validators/partnership.validator.js";

export const serviceRouter = crudRouter(cms.services, serviceSchema, "services");
const branchesCrud = crudRouter(cms.branches, branchSchema, "branches");
export const branchRouter = Router();
branchRouter.get("/import/template", requirePermission("branches"), branchImport.downloadTemplate);
branchRouter.post("/import", requirePermission("branches"), upload.single("file"), branchImport.importExcel);
branchRouter.use(branchesCrud);
export const partnerRouter = crudRouter(cms.partners, partnerSchema, "partners");

export const partnershipSettingsRouter = Router();
partnershipSettingsRouter.use(requirePermission("partners"));
partnershipSettingsRouter.get("/", partnershipAdmin.settings);
partnershipSettingsRouter.patch("/", validate(partnershipSettingsSchema), partnershipAdmin.updateSettings);
partnershipSettingsRouter.post("/agreements/:slot", upload.single("file"), partnershipAdmin.uploadAgreement);

export const partnerApplicationRouter = Router();
partnerApplicationRouter.use(requirePermission("partners"));
partnerApplicationRouter.get("/", partnershipAdmin.listApplications);
partnerApplicationRouter.get("/:id/files/:docKey", partnershipAdmin.downloadDocument);
partnerApplicationRouter.get("/:id", partnershipAdmin.getApplication);
partnerApplicationRouter.patch("/:id", validate(partnerApplicationUpdateSchema), partnershipAdmin.updateApplication);
partnerApplicationRouter.delete("/:id", partnershipAdmin.removeApplication);
export const newsRouter = crudRouter(cms.news, newsSchema, "news");
export const faqRouter = crudRouter(cms.faqs, faqSchema, "faq");
export const remittanceRouter = crudRouter(cms.remittances, remittanceSchema, "remittances");
export const galleryRouter = crudRouter(cms.gallery, gallerySchema, "gallery");
export const documentRouter = crudRouter(cms.documents, documentSchema, "documents");
export const pageRouter = crudRouter(cms.pages, pageSchema, "website_cms");
export const sectionRouter = crudRouter(cms.sections, sectionSchema, "website_cms");
export const navigationRouter = crudRouter(cms.navigation, navigationSchema, "website_cms");
export const socialRouter = crudRouter(cms.social, socialSchema, "website_cms");
export const teamRouter = crudRouter(cms.team, teamSchema, "about");

export const aboutRouter = Router();
aboutRouter.get("/", requirePermission("about"), cms.about.get);
aboutRouter.patch("/", requirePermission("about"), cms.about.update);

export const serviceChargeRouter = Router();
serviceChargeRouter.get("/page", requirePermission("services"), cms.serviceChargePage.get);
serviceChargeRouter.patch("/page", requirePermission("services"), validate(serviceChargePageSchema), cms.serviceChargePage.update);
serviceChargeRouter.use(crudRouter(cms.serviceCharges, serviceChargeRowSchema, "services"));

export const contactRouter = Router();
contactRouter.use(requirePermission("contact"));
contactRouter.get("/", cms.contact.list);
contactRouter.patch("/:id", cms.contact.update);
contactRouter.delete("/:id", cms.contact.remove);

export const mediaRouter = Router();
mediaRouter.use(requirePermission("media"));
mediaRouter.get("/", cms.media.list);
mediaRouter.post("/", upload.single("file"), cms.media.upload);
mediaRouter.patch("/:id", cms.media.update);
mediaRouter.delete("/:id", cms.media.remove);
