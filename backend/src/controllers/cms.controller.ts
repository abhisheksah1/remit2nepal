import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import { parsePagination } from "../utils/pagination.js";
import { branchCatalog, branchFilterMeta, searchBranches } from "../services/branch.service.js";
import { createService, serviceCatalog } from "../services/service-catalog.service.js";
import {
  createNews,
  createPage,
  documentCatalog,
  faqCatalog,
  galleryCatalog,
  navigationCatalog,
  newsCatalog,
  pageCatalog,
  partnerCatalog,
  publicDocuments,
  publicNews,
  sectionCatalog,
  socialCatalog,
  teamCatalog
} from "../services/content.service.js";
import * as aboutService from "../services/about.service.js";
import * as contactService from "../services/contact.service.js";
import * as mediaService from "../services/media.service.js";
import * as siteService from "../services/site.service.js";
import { publicRates } from "../services/exchange-rate.service.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

function listHandler(service: { list: (page: number, limit: number, search?: string, extra?: Record<string, unknown>) => Promise<unknown> }) {
  return asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query as Record<string, unknown>);
    sendSuccess(res, await service.list(page, limit, req.query.search as string | undefined, req.query.status ? { status: req.query.status } : {}));
  });
}

function getHandler(service: { get: (id: string) => Promise<unknown> }) {
  return asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await service.get(req.params.id as string));
  });
}

function createHandler(service: { create: (input: Record<string, unknown>, req: Request) => Promise<unknown> }) {
  return asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await service.create(req.body, req), "Created", 201);
  });
}

function updateHandler(service: { update: (id: string, input: Record<string, unknown>, req: Request) => Promise<unknown> }) {
  return asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await service.update(req.params.id as string, req.body, req), "Updated");
  });
}

function deleteHandler(service: { remove: (id: string, req: Request) => Promise<unknown> }) {
  return asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await service.remove(req.params.id as string, req), "Deleted");
  });
}

export const services = {
  list: listHandler(serviceCatalog),
  get: getHandler(serviceCatalog),
  create: asyncHandler(async (req, res) => sendSuccess(res, await createService(req.body, req), "Created", 201)),
  update: updateHandler(serviceCatalog),
  remove: deleteHandler(serviceCatalog)
};

export const branches = {
  list: listHandler(branchCatalog),
  get: getHandler(branchCatalog),
  create: createHandler(branchCatalog),
  update: updateHandler(branchCatalog),
  remove: deleteHandler(branchCatalog)
};

export const partners = {
  list: listHandler(partnerCatalog),
  get: getHandler(partnerCatalog),
  create: createHandler(partnerCatalog),
  update: updateHandler(partnerCatalog),
  remove: deleteHandler(partnerCatalog)
};

export const news = {
  list: listHandler(newsCatalog),
  get: getHandler(newsCatalog),
  create: asyncHandler(async (req, res) => sendSuccess(res, await createNews(req.body, req), "Created", 201)),
  update: updateHandler(newsCatalog),
  remove: deleteHandler(newsCatalog)
};

export const faqs = {
  list: listHandler(faqCatalog),
  get: getHandler(faqCatalog),
  create: createHandler(faqCatalog),
  update: updateHandler(faqCatalog),
  remove: deleteHandler(faqCatalog)
};

export const gallery = {
  list: listHandler(galleryCatalog),
  get: getHandler(galleryCatalog),
  create: createHandler(galleryCatalog),
  update: updateHandler(galleryCatalog),
  remove: deleteHandler(galleryCatalog)
};

export const documents = {
  list: listHandler(documentCatalog),
  get: getHandler(documentCatalog),
  create: createHandler(documentCatalog),
  update: updateHandler(documentCatalog),
  remove: deleteHandler(documentCatalog)
};

export const pages = {
  list: listHandler(pageCatalog),
  get: getHandler(pageCatalog),
  create: asyncHandler(async (req, res) => sendSuccess(res, await createPage(req.body, req), "Created", 201)),
  update: updateHandler(pageCatalog),
  remove: deleteHandler(pageCatalog)
};

export const sections = {
  list: listHandler(sectionCatalog),
  get: getHandler(sectionCatalog),
  create: createHandler(sectionCatalog),
  update: updateHandler(sectionCatalog),
  remove: deleteHandler(sectionCatalog)
};

export const navigation = {
  list: listHandler(navigationCatalog),
  get: getHandler(navigationCatalog),
  create: createHandler(navigationCatalog),
  update: updateHandler(navigationCatalog),
  remove: deleteHandler(navigationCatalog)
};

export const social = {
  list: listHandler(socialCatalog),
  get: getHandler(socialCatalog),
  create: createHandler(socialCatalog),
  update: updateHandler(socialCatalog),
  remove: deleteHandler(socialCatalog)
};

export const team = {
  list: listHandler(teamCatalog),
  get: getHandler(teamCatalog),
  create: createHandler(teamCatalog),
  update: updateHandler(teamCatalog),
  remove: deleteHandler(teamCatalog)
};

export const about = {
  get: asyncHandler(async (_req, res) => sendSuccess(res, await aboutService.getAbout())),
  update: asyncHandler(async (req, res) => sendSuccess(res, await aboutService.updateAbout(req.body, req), "About updated"))
};

export const contact = {
  list: asyncHandler(async (req, res) => {
    const { page, limit } = parsePagination(req.query as Record<string, unknown>);
    sendSuccess(res, await contactService.listContactMessages(page, limit, req.query.status as string | undefined, req.query.search as string | undefined));
  }),
  update: asyncHandler(async (req, res) => sendSuccess(res, await contactService.updateContactStatus(req.params.id as string, req.body.status, req))),
  remove: asyncHandler(async (req, res) => sendSuccess(res, await contactService.deleteContact(req.params.id as string, req), "Deleted"))
};

export const media = {
  list: asyncHandler(async (req, res) => {
    const { page, limit } = parsePagination(req.query as Record<string, unknown>);
    sendSuccess(res, await mediaService.listMedia(page, limit, req.query.search as string | undefined));
  }),
  upload: asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError("File is required", 400);
    sendSuccess(res, await mediaService.storeUpload(req.file, req, req.body.altText, req.body.folder || "general"), "Uploaded", 201);
  }),
  update: asyncHandler(async (req, res) => sendSuccess(res, await mediaService.updateMedia(req.params.id as string, req.body))),
  remove: asyncHandler(async (req, res) => {
    await mediaService.deleteMedia(req.params.id as string, req);
    sendSuccess(res, null, "Deleted");
  })
};

export const publicApi = {
  site: asyncHandler(async (_req, res) => sendSuccess(res, await siteService.getPublicSite())),
  home: asyncHandler(async (_req, res) => sendSuccess(res, await siteService.getHomePayload())),
  rates: asyncHandler(async (_req, res) => sendSuccess(res, await publicRates())),
  branches: asyncHandler(async (req, res) => sendSuccess(res, await searchBranches(req.query as never))),
  branchFilters: asyncHandler(async (_req, res) => sendSuccess(res, await branchFilterMeta())),
  branch: asyncHandler(async (req, res) => sendSuccess(res, await branchCatalog.get(req.params.id as string))),
  services: asyncHandler(async (_req, res) => sendSuccess(res, await serviceCatalog.publicList())),
  service: asyncHandler(async (req, res) => sendSuccess(res, await serviceCatalog.get(req.params.id as string))),
  news: asyncHandler(async (req, res) => sendSuccess(res, await publicNews(req.query.category as string | undefined))),
  faqs: asyncHandler(async (_req, res) => sendSuccess(res, await siteService.getPublicFaqs())),
  gallery: asyncHandler(async (_req, res) => sendSuccess(res, await siteService.getPublicGallery())),
  documents: asyncHandler(async (_req, res) => sendSuccess(res, await publicDocuments())),
  partners: asyncHandler(async (_req, res) => sendSuccess(res, await partnerCatalog.publicList())),
  page: asyncHandler(async (req, res) => sendSuccess(res, await siteService.getPublishedPage(req.params.slug as string))),
  contact: asyncHandler(async (req, res) => {
    await contactService.createContactMessage(req.body);
    sendSuccess(res, null, "Message received", 201);
  }),
  robots: asyncHandler(async (_req, res) => {
    res.type("text/plain").send(siteService.robotsTxt(env.FRONTEND_URL));
  }),
  sitemap: asyncHandler(async (_req, res) => {
    res.type("application/xml").send(await siteService.sitemapXml(env.FRONTEND_URL));
  })
};
