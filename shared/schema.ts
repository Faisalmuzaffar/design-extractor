import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const extractedElements = pgTable("extracted_elements", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  elements: jsonb("elements").notNull().$type<{
    type: string;
    name: string;
    details: string;
    value?: string;
  }[]>(),
});

export const insertElementsSchema = createInsertSchema(extractedElements);

export type InsertElements = z.infer<typeof insertElementsSchema>;
export type ExtractedElements = typeof extractedElements.$inferSelect;
