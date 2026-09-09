import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/api-response.js";
import { parsePagination } from "../utils/pagination.js";
import { AppError } from "../utils/app-error.js";
import * as chatbot from "../services/chatbot.service.js";

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

export const chatbotQa = {
  list: listHandler(chatbot.chatbotQaCatalog),
  get: getHandler(chatbot.chatbotQaCatalog),
  create: createHandler(chatbot.chatbotQaCatalog),
  update: updateHandler(chatbot.chatbotQaCatalog),
  remove: deleteHandler(chatbot.chatbotQaCatalog)
};

export const chatbotSteps = {
  list: listHandler(chatbot.chatbotStepCatalog),
  get: getHandler(chatbot.chatbotStepCatalog),
  create: createHandler(chatbot.chatbotStepCatalog),
  update: updateHandler(chatbot.chatbotStepCatalog),
  remove: deleteHandler(chatbot.chatbotStepCatalog)
};

export const chatbotAdmin = {
  settings: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await chatbot.getChatbotSettings());
  }),
  updateSettings: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await chatbot.updateChatbotSettings(req.body, req), "Chatbot updated");
  }),
  knowledge: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await chatbot.listKnowledgeDocs());
  }),
  uploadKnowledge: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("PDF file is required", 400);
    sendSuccess(
      res,
      await chatbot.uploadKnowledgeDoc(req.file, { title: req.body.title, category: req.body.category }, req),
      "Guide uploaded",
      201
    );
  }),
  removeKnowledge: asyncHandler(async (req: Request, res: Response) => {
    await chatbot.deleteKnowledgeDoc(req.params.id as string, req);
    sendSuccess(res, null, "Deleted");
  })
};

export const chatbotPublic = {
  config: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await chatbot.getPublicChatbot());
  }),
  ask: asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, await chatbot.answerChat(req.body.message));
  })
};
