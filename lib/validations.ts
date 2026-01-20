import { z } from "zod";

export const TicketTypeSchema = z.enum(["regular", "vip"]);

export const DietaryNeedSchema = z.enum([
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "nut-allergies",
  "no-restrictions",
]);

export const MealChoiceSchema = z.enum([
  "chicken",
  "beef",
  "fish",
  "vegetarian",
]);

export const CreateTicketSchema = z.object({
  type: TicketTypeSchema,
  quantity: z.number().int().min(1).max(100),
});

export const TicketSubmissionSchema = z.object({
  dietary_needs: z
    .array(DietaryNeedSchema)
    .min(1, "Please select at least one dietary preference"),
  meal_choice: MealChoiceSchema,
});

export const TicketCodeSchema = z
  .string()
  .length(8, "Ticket code must be 8 characters")
  .regex(/^[A-Z]{3}\d{5}$/, "Invalid ticket code format");
