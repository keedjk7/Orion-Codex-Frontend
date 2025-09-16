import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProfitLossStatementSchema,
  insertBalanceSheetSchema,
  insertCashFlowStatementSchema,
  insertPlAccountSchema,
  insertIoMappingSchema,
  insertCompanySchema
} from "@shared/schema";
import { ZodError } from "zod";

// Partial schemas for updates - only allow known fields to be updated
const updateProfitLossStatementSchema = insertProfitLossStatementSchema.partial();
const updateBalanceSheetSchema = insertBalanceSheetSchema.partial();
const updateCashFlowStatementSchema = insertCashFlowStatementSchema.partial();
const updatePlAccountSchema = insertPlAccountSchema.partial();
const updateIoMappingSchema = insertIoMappingSchema.partial();
const updateCompanySchema = insertCompanySchema.partial();

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard API routes
  app.get("/api/market-data", async (req, res) => {
    try {
      const marketData = await storage.getAllMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get("/api/business-news", async (req, res) => {
    try {
      const { category } = req.query;
      let businessNews;
      
      if (category && typeof category === "string") {
        businessNews = await storage.getBusinessNewsByCategory(category);
      } else {
        businessNews = await storage.getAllBusinessNews();
      }
      
      res.json(businessNews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business news" });
    }
  });

  app.get("/api/company-metrics", async (req, res) => {
    try {
      const companyMetrics = await storage.getAllCompanyMetrics();
      res.json(companyMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company metrics" });
    }
  });

  app.get("/api/economic-indicators", async (req, res) => {
    try {
      const economicIndicators = await storage.getAllEconomicIndicators();
      res.json(economicIndicators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch economic indicators" });
    }
  });

  // Individual resource endpoints
  app.get("/api/market-data/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const marketData = await storage.getMarketDataBySymbol(symbol.toUpperCase());
      
      if (!marketData) {
        return res.status(404).json({ message: "Market data not found" });
      }
      
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get("/api/company-metrics/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const companyMetrics = await storage.getCompanyMetricsBySymbol(symbol.toUpperCase());
      
      if (!companyMetrics) {
        return res.status(404).json({ message: "Company metrics not found" });
      }
      
      res.json(companyMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company metrics" });
    }
  });

  // Financial Reports API routes
  // Profit & Loss Statement routes
  app.get("/api/profit-loss", async (req, res) => {
    try {
      const { topic, startPeriod, endPeriod } = req.query;
      let statements;
      
      if (topic || startPeriod || endPeriod) {
        statements = await storage.getProfitLossStatementsFiltered(
          topic as string, 
          startPeriod as string,
          endPeriod as string
        );
      } else {
        statements = await storage.getAllProfitLossStatements();
      }
      
      res.json(statements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profit & loss statements" });
    }
  });

  app.put("/api/profit-loss/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate request body using Zod schema
      const validationResult = updateProfitLossStatementSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const updates = validationResult.data;
      const updatedStatement = await storage.updateProfitLossStatement(id, updates);
      
      if (!updatedStatement) {
        return res.status(404).json({ message: "Profit & loss statement not found" });
      }
      
      res.json(updatedStatement);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      console.error("Error updating P&L statement:", error);
      res.status(500).json({ message: "Failed to update profit & loss statement" });
    }
  });

  // Balance Sheet routes
  app.get("/api/balance-sheet", async (req, res) => {
    try {
      const { topic, startPeriod, endPeriod } = req.query;
      let sheets;
      
      if (topic || startPeriod || endPeriod) {
        sheets = await storage.getBalanceSheetsFiltered(
          topic as string, 
          startPeriod as string,
          endPeriod as string
        );
      } else {
        sheets = await storage.getAllBalanceSheets();
      }
      
      res.json(sheets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch balance sheets" });
    }
  });

  app.put("/api/balance-sheet/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate request body using Zod schema
      const validationResult = updateBalanceSheetSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const updates = validationResult.data;
      const updatedSheet = await storage.updateBalanceSheet(id, updates);
      
      if (!updatedSheet) {
        return res.status(404).json({ message: "Balance sheet not found" });
      }
      
      res.json(updatedSheet);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      console.error("Error updating balance sheet:", error);
      res.status(500).json({ message: "Failed to update balance sheet" });
    }
  });

  // Cash Flow Statement routes
  app.get("/api/cash-flow", async (req, res) => {
    try {
      const { topic, startPeriod, endPeriod } = req.query;
      let statements;
      
      if (topic || startPeriod || endPeriod) {
        statements = await storage.getCashFlowStatementsFiltered(
          topic as string, 
          startPeriod as string,
          endPeriod as string
        );
      } else {
        statements = await storage.getAllCashFlowStatements();
      }
      
      res.json(statements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cash flow statements" });
    }
  });

  app.put("/api/cash-flow/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate request body using Zod schema
      const validationResult = updateCashFlowStatementSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const updates = validationResult.data;
      const updatedStatement = await storage.updateCashFlowStatement(id, updates);
      
      if (!updatedStatement) {
        return res.status(404).json({ message: "Cash flow statement not found" });
      }
      
      res.json(updatedStatement);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      console.error("Error updating cash flow statement:", error);
      res.status(500).json({ message: "Failed to update cash flow statement" });
    }
  });

  // PL Accounts API routes
  app.get("/api/pl-accounts", async (req, res) => {
    try {
      const plAccounts = await storage.getAllPlAccounts();
      res.json(plAccounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch PL accounts" });
    }
  });

  app.get("/api/pl-accounts/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const plAccounts = await storage.searchPlAccounts(q);
      res.json(plAccounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to search PL accounts" });
    }
  });

  app.post("/api/pl-accounts", async (req, res) => {
    try {
      const validationResult = insertPlAccountSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const newPlAccount = await storage.createPlAccount(validationResult.data);
      res.status(201).json(newPlAccount);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create PL account" });
    }
  });

  app.put("/api/pl-accounts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const validationResult = updatePlAccountSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const updates = validationResult.data;
      const updatedPlAccount = await storage.updatePlAccount(id, updates);
      
      if (!updatedPlAccount) {
        return res.status(404).json({ message: "PL account not found" });
      }
      
      res.json(updatedPlAccount);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update PL account" });
    }
  });

  app.delete("/api/pl-accounts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePlAccount(id);
      
      if (!success) {
        return res.status(404).json({ message: "PL account not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete PL account" });
    }
  });

  // IO Mappings API routes
  app.get("/api/io-mappings", async (req, res) => {
    try {
      const ioMappings = await storage.getAllIoMappings();
      res.json(ioMappings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch IO mappings" });
    }
  });

  app.post("/api/io-mappings", async (req, res) => {
    try {
      const validationResult = insertIoMappingSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const newIoMapping = await storage.createIoMapping(validationResult.data);
      res.status(201).json(newIoMapping);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create IO mapping" });
    }
  });

  app.put("/api/io-mappings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const validationResult = updateIoMappingSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const updates = validationResult.data;
      const updatedIoMapping = await storage.updateIoMapping(id, updates);
      
      if (!updatedIoMapping) {
        return res.status(404).json({ message: "IO mapping not found" });
      }
      
      res.json(updatedIoMapping);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update IO mapping" });
    }
  });

  app.delete("/api/io-mappings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteIoMapping(id);
      
      if (!success) {
        return res.status(404).json({ message: "IO mapping not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete IO mapping" });
    }
  });

  // Company API routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getAllCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const companies = await storage.searchCompanies(q);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to search companies" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const validationResult = insertCompanySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const newCompany = await storage.createCompany(validationResult.data);
      res.status(201).json(newCompany);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const validationResult = updateCompanySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: validationResult.error.errors 
        });
      }
      
      const updates = validationResult.data;
      const updatedCompany = await storage.updateCompany(id, updates);
      
      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(updatedCompany);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCompany(id);
      
      if (!success) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete company" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
