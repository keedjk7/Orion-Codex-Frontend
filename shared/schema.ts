import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  change: decimal("change", { precision: 10, scale: 2 }).notNull(),
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }).notNull(),
  volume: integer("volume").notNull(),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }),
  sector: text("sector"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const businessNews = pgTable("business_news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  importance: text("importance").notNull(), // high, medium, low
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  source: text("source").notNull(),
});

export const companyMetrics = pgTable("company_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  symbol: text("symbol").notNull(),
  revenue: decimal("revenue", { precision: 15, scale: 2 }).notNull(),
  profit: decimal("profit", { precision: 15, scale: 2 }).notNull(),
  employees: integer("employees").notNull(),
  industry: text("industry").notNull(),
  headquarters: text("headquarters").notNull(),
  description: text("description").notNull(),
  keyMetrics: text("key_metrics").notNull(), // JSON string with additional metrics
});

export const economicIndicators = pgTable("economic_indicators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  value: decimal("value", { precision: 10, scale: 4 }).notNull(),
  unit: text("unit").notNull(),
  change: decimal("change", { precision: 10, scale: 4 }).notNull(),
  period: text("period").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  updatedAt: true,
});

export const insertBusinessNewsSchema = createInsertSchema(businessNews).omit({
  id: true,
  publishedAt: true,
});

export const insertCompanyMetricsSchema = createInsertSchema(companyMetrics).omit({
  id: true,
});

export const insertEconomicIndicatorsSchema = createInsertSchema(economicIndicators).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;
export type BusinessNews = typeof businessNews.$inferSelect;
export type CompanyMetrics = typeof companyMetrics.$inferSelect;
export type EconomicIndicators = typeof economicIndicators.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type InsertBusinessNews = z.infer<typeof insertBusinessNewsSchema>;
export type InsertCompanyMetrics = z.infer<typeof insertCompanyMetricsSchema>;
export type InsertEconomicIndicators = z.infer<typeof insertEconomicIndicatorsSchema>;
