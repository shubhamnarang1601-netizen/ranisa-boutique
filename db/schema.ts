import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  fabric: text("fabric").notNull().default(""),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull().default(""),
  description: text("description").notNull().default(""),
  createdAt: integer("created_at").notNull(),
});
