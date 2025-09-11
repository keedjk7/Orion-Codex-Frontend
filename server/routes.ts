import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);

  return httpServer;
}
