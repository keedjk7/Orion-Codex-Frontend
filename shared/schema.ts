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

// Financial Reports Tables
export const profitLossStatement = pgTable("profit_loss_statement", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topic: text("topic").notNull(), // e.g., "Company A", "Division B", etc.
  period: text("period").notNull(), // e.g., "2024-01", "2024-Q1", etc.
  
  // Revenue section
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).notNull(),
  costOfGoodsSold: decimal("cost_of_goods_sold", { precision: 15, scale: 2 }).notNull(),
  grossProfit: decimal("gross_profit", { precision: 15, scale: 2 }).notNull(),
  
  // Operating expenses
  operatingExpenses: decimal("operating_expenses", { precision: 15, scale: 2 }).notNull(),
  operatingIncome: decimal("operating_income", { precision: 15, scale: 2 }).notNull(),
  
  // Other income/expenses
  otherIncome: decimal("other_income", { precision: 15, scale: 2 }).notNull().default("0"),
  otherExpenses: decimal("other_expenses", { precision: 15, scale: 2 }).notNull().default("0"),
  
  // Final calculations
  netIncomeBeforeTax: decimal("net_income_before_tax", { precision: 15, scale: 2 }).notNull(),
  taxExpense: decimal("tax_expense", { precision: 15, scale: 2 }).notNull(),
  netIncome: decimal("net_income", { precision: 15, scale: 2 }).notNull(),
  
  // Metadata
  isEditable: text("is_editable").notNull().default("true"), // JSON string of editable fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const balanceSheet = pgTable("balance_sheet", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topic: text("topic").notNull(),
  period: text("period").notNull(),
  
  // Assets
  currentAssets: decimal("current_assets", { precision: 15, scale: 2 }).notNull(),
  cash: decimal("cash", { precision: 15, scale: 2 }).notNull(),
  accountsReceivable: decimal("accounts_receivable", { precision: 15, scale: 2 }).notNull(),
  inventory: decimal("inventory", { precision: 15, scale: 2 }).notNull(),
  
  nonCurrentAssets: decimal("non_current_assets", { precision: 15, scale: 2 }).notNull(),
  propertyPlantEquipment: decimal("property_plant_equipment", { precision: 15, scale: 2 }).notNull(),
  intangibleAssets: decimal("intangible_assets", { precision: 15, scale: 2 }).notNull(),
  
  totalAssets: decimal("total_assets", { precision: 15, scale: 2 }).notNull(),
  
  // Liabilities
  currentLiabilities: decimal("current_liabilities", { precision: 15, scale: 2 }).notNull(),
  accountsPayable: decimal("accounts_payable", { precision: 15, scale: 2 }).notNull(),
  shortTermDebt: decimal("short_term_debt", { precision: 15, scale: 2 }).notNull(),
  
  longTermLiabilities: decimal("long_term_liabilities", { precision: 15, scale: 2 }).notNull(),
  longTermDebt: decimal("long_term_debt", { precision: 15, scale: 2 }).notNull(),
  
  totalLiabilities: decimal("total_liabilities", { precision: 15, scale: 2 }).notNull(),
  
  // Equity
  shareholdersEquity: decimal("shareholders_equity", { precision: 15, scale: 2 }).notNull(),
  retainedEarnings: decimal("retained_earnings", { precision: 15, scale: 2 }).notNull(),
  
  // Metadata
  isEditable: text("is_editable").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cashFlowStatement = pgTable("cash_flow_statement", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topic: text("topic").notNull(),
  period: text("period").notNull(),
  
  // Operating activities
  operatingCashFlow: decimal("operating_cash_flow", { precision: 15, scale: 2 }).notNull(),
  netIncome: decimal("net_income", { precision: 15, scale: 2 }).notNull(),
  depreciation: decimal("depreciation", { precision: 15, scale: 2 }).notNull(),
  changeInWorkingCapital: decimal("change_in_working_capital", { precision: 15, scale: 2 }).notNull(),
  
  // Investing activities
  investingCashFlow: decimal("investing_cash_flow", { precision: 15, scale: 2 }).notNull(),
  capitalExpenditures: decimal("capital_expenditures", { precision: 15, scale: 2 }).notNull(),
  acquisitions: decimal("acquisitions", { precision: 15, scale: 2 }).notNull().default("0"),
  
  // Financing activities
  financingCashFlow: decimal("financing_cash_flow", { precision: 15, scale: 2 }).notNull(),
  debtIssuance: decimal("debt_issuance", { precision: 15, scale: 2 }).notNull().default("0"),
  debtRepayment: decimal("debt_repayment", { precision: 15, scale: 2 }).notNull().default("0"),
  dividendsPaid: decimal("dividends_paid", { precision: 15, scale: 2 }).notNull().default("0"),
  
  // Net change
  netChangeInCash: decimal("net_change_in_cash", { precision: 15, scale: 2 }).notNull(),
  beginningCashBalance: decimal("beginning_cash_balance", { precision: 15, scale: 2 }).notNull(),
  endingCashBalance: decimal("ending_cash_balance", { precision: 15, scale: 2 }).notNull(),
  
  // Metadata
  isEditable: text("is_editable").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Custom decimal validation schema
const decimalSchema = z.string().refine((value) => {
  // Allow empty or basic decimal format
  if (!value || value.trim() === '') return false;
  
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return false;
  
  // Check for valid decimal format (allow integers and decimals with max 2 places)
  const decimalPattern = /^\d+(\.\d{1,2})?$/;
  return decimalPattern.test(value.trim());
}, {
  message: "Must be a valid non-negative decimal number with max 2 decimal places"
});

// Insert schemas for financial reports with proper validation
export const insertProfitLossStatementSchema = createInsertSchema(profitLossStatement).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  totalRevenue: decimalSchema,
  costOfGoodsSold: decimalSchema,
  grossProfit: decimalSchema,
  operatingExpenses: decimalSchema,
  operatingIncome: decimalSchema,
  otherIncome: decimalSchema,
  otherExpenses: decimalSchema,
  netIncomeBeforeTax: decimalSchema,
  taxExpense: decimalSchema,
  netIncome: decimalSchema,
});

export const insertBalanceSheetSchema = createInsertSchema(balanceSheet).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  currentAssets: decimalSchema,
  cash: decimalSchema,
  accountsReceivable: decimalSchema,
  inventory: decimalSchema,
  nonCurrentAssets: decimalSchema,
  propertyPlantEquipment: decimalSchema,
  intangibleAssets: decimalSchema,
  totalAssets: decimalSchema,
  currentLiabilities: decimalSchema,
  accountsPayable: decimalSchema,
  shortTermDebt: decimalSchema,
  longTermLiabilities: decimalSchema,
  longTermDebt: decimalSchema,
  totalLiabilities: decimalSchema,
  shareholdersEquity: decimalSchema,
  retainedEarnings: decimalSchema,
});

export const insertCashFlowStatementSchema = createInsertSchema(cashFlowStatement).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  operatingCashFlow: decimalSchema,
  netIncome: decimalSchema,
  depreciation: decimalSchema,
  changeInWorkingCapital: decimalSchema,
  investingCashFlow: decimalSchema,
  capitalExpenditures: decimalSchema,
  acquisitions: decimalSchema,
  financingCashFlow: decimalSchema,
  debtIssuance: decimalSchema,
  debtRepayment: decimalSchema,
  dividendsPaid: decimalSchema,
  netChangeInCash: decimalSchema,
  beginningCashBalance: decimalSchema,
  endingCashBalance: decimalSchema,
});

// Types for financial reports
export type ProfitLossStatement = typeof profitLossStatement.$inferSelect;
export type BalanceSheet = typeof balanceSheet.$inferSelect;
export type CashFlowStatement = typeof cashFlowStatement.$inferSelect;
export type InsertProfitLossStatement = z.infer<typeof insertProfitLossStatementSchema>;
export type InsertBalanceSheet = z.infer<typeof insertBalanceSheetSchema>;
export type InsertCashFlowStatement = z.infer<typeof insertCashFlowStatementSchema>;

// PL Account Table
export const plAccounts = pgTable("pl_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plAccount: text("pl_account").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPlAccountSchema = createInsertSchema(plAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for PL Account
export type PlAccount = typeof plAccounts.$inferSelect;
export type InsertPlAccount = z.infer<typeof insertPlAccountSchema>;

// IO Mapping Table
export const ioMappings = pgTable("io_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  accountId: varchar("account_id").notNull().references(() => plAccounts.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIoMappingSchema = createInsertSchema(ioMappings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for IO Mapping
export type IoMapping = typeof ioMappings.$inferSelect;
export type InsertIoMapping = z.infer<typeof insertIoMappingSchema>;

// Company Table
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyCode: text("company_code").notNull().unique(),
  shortName: text("short_name").notNull(),
  fullName: text("full_name").notNull().unique(),
  description: text("description"),
  industry: text("industry"),
  headquarters: text("headquarters"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for Company
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;