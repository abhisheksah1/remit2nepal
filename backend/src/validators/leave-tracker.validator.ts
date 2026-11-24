import { z } from "zod";

export const leaveLoginSchema = z.object({
  userId: z.string().min(3).max(64),
  password: z.string().min(1).max(128),
  rememberMe: z.boolean().optional()
});

export const leaveUserCreateSchema = z.object({
  fullName: z.string().min(2).max(120),
  userId: z.string().min(3).max(64).regex(/^[a-zA-Z0-9._-]+$/),
  password: z.string().min(8).max(128),
  email: z.string().email().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const leaveUserUpdateSchema = leaveUserCreateSchema.partial();

export const leaveEmployeeSchema = z.object({
  employeeId: z.string().min(1).max(40),
  name: z.string().min(2).max(160),
  department: z.string().min(2).max(120),
  designation: z.string().max(120).optional().or(z.literal("")),
  joinDate: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  photoUrl: z.string().max(400).optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const leaveEmployeeUpdateSchema = leaveEmployeeSchema.partial();

export const leaveTypeSchema = z.object({
  name: z.string().min(2).max(80),
  daysAllowed: z.coerce.number().int().min(0).max(365),
  paid: z.boolean().optional(),
  color: z.string().max(20).optional(),
  description: z.string().max(400).optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const leaveTypeUpdateSchema = leaveTypeSchema.partial();

export const leaveRequestSchema = z.object({
  employee: z.string().min(1),
  leaveType: z.string().min(1).optional(),
  span: z.enum(["SINGLE", "RANGE"]).optional(),
  kind: z.enum(["PRESENT", "FULL", "HALF", "OVERTIME"]).optional(),
  fromDate: z.string().min(8),
  toDate: z.string().min(8).optional(),
  reason: z.string().max(500).optional().or(z.literal("")),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
  reviewNote: z.string().max(400).optional().or(z.literal(""))
});

export const leaveMarkSchema = z
  .object({
    employee: z.string().min(1),
    dates: z.array(z.string().min(8)).optional(),
    mark: z.enum(["P", "A", "H", "O"]).optional(),
    days: z.array(z.object({ date: z.string().min(8), mark: z.enum(["P", "A", "H", "O"]) })).optional(),
    reason: z.string().max(500).optional().or(z.literal(""))
  })
  .refine((value) => (value.days && value.days.length > 0) || (value.dates && value.dates.length > 0 && value.mark), {
    message: "Select dates and a mark"
  });

export const leaveRequestUpdateSchema = leaveRequestSchema.partial();
