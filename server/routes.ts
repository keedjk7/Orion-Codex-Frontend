import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProfitLossStatementSchema,
  insertBalanceSheetSchema,
  insertCashFlowStatementSchema
} from "@shared/schema";

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
      const { topic, period } = req.query;
      let statements;
      
      if (topic || period) {
        statements = await storage.getProfitLossStatementsFiltered(
          topic as string, 
          period as string
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
      const updates = req.body;
      
      const updatedStatement = await storage.updateProfitLossStatement(id, updates);
      
      if (!updatedStatement) {
        return res.status(404).json({ message: "Profit & loss statement not found" });
      }
      
      res.json(updatedStatement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profit & loss statement" });
    }
  });

  // Balance Sheet routes
  app.get("/api/balance-sheet", async (req, res) => {
    try {
      const { topic, period } = req.query;
      let sheets;
      
      if (topic || period) {
        sheets = await storage.getBalanceSheetsFiltered(
          topic as string, 
          period as string
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
      const updates = req.body;
      
      const updatedSheet = await storage.updateBalanceSheet(id, updates);
      
      if (!updatedSheet) {
        return res.status(404).json({ message: "Balance sheet not found" });
      }
      
      res.json(updatedSheet);
    } catch (error) {
      res.status(500).json({ message: "Failed to update balance sheet" });
    }
  });

  // Cash Flow Statement routes
  app.get("/api/cash-flow", async (req, res) => {
    try {
      const { topic, period } = req.query;
      let statements;
      
      if (topic || period) {
        statements = await storage.getCashFlowStatementsFiltered(
          topic as string, 
          period as string
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
      const updates = req.body;
      
      const updatedStatement = await storage.updateCashFlowStatement(id, updates);
      
      if (!updatedStatement) {
        return res.status(404).json({ message: "Cash flow statement not found" });
      }
      
      res.json(updatedStatement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cash flow statement" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
