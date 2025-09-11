import { 
  type User, 
  type InsertUser,
  type MarketData,
  type InsertMarketData,
  type BusinessNews,
  type InsertBusinessNews,
  type CompanyMetrics,
  type InsertCompanyMetrics,
  type EconomicIndicators,
  type InsertEconomicIndicators
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Market data methods
  getAllMarketData(): Promise<MarketData[]>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
  
  // Business news methods
  getAllBusinessNews(): Promise<BusinessNews[]>;
  getBusinessNewsByCategory(category: string): Promise<BusinessNews[]>;
  createBusinessNews(news: InsertBusinessNews): Promise<BusinessNews>;
  
  // Company metrics methods
  getAllCompanyMetrics(): Promise<CompanyMetrics[]>;
  getCompanyMetricsBySymbol(symbol: string): Promise<CompanyMetrics | undefined>;
  createCompanyMetrics(metrics: InsertCompanyMetrics): Promise<CompanyMetrics>;
  
  // Economic indicators methods
  getAllEconomicIndicators(): Promise<EconomicIndicators[]>;
  createEconomicIndicator(indicator: InsertEconomicIndicators): Promise<EconomicIndicators>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private marketData: Map<string, MarketData>;
  private businessNews: Map<string, BusinessNews>;
  private companyMetrics: Map<string, CompanyMetrics>;
  private economicIndicators: Map<string, EconomicIndicators>;

  constructor() {
    this.users = new Map();
    this.marketData = new Map();
    this.businessNews = new Map();
    this.companyMetrics = new Map();
    this.economicIndicators = new Map();
    
    // Initialize with sample data synchronously
    this.initializeSampleDataSync();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Market data methods
  async getAllMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values());
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    return Array.from(this.marketData.values()).find(data => data.symbol === symbol);
  }

  async createMarketData(insertData: InsertMarketData): Promise<MarketData> {
    const id = randomUUID();
    const data: MarketData = { 
      ...insertData,
      marketCap: insertData.marketCap ?? null,
      sector: insertData.sector ?? null,
      id, 
      updatedAt: new Date()
    };
    this.marketData.set(id, data);
    return data;
  }

  // Business news methods
  async getAllBusinessNews(): Promise<BusinessNews[]> {
    return Array.from(this.businessNews.values()).sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }

  async getBusinessNewsByCategory(category: string): Promise<BusinessNews[]> {
    return Array.from(this.businessNews.values())
      .filter(news => news.category === category)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async createBusinessNews(insertNews: InsertBusinessNews): Promise<BusinessNews> {
    const id = randomUUID();
    const news: BusinessNews = {
      ...insertNews,
      id,
      publishedAt: new Date()
    };
    this.businessNews.set(id, news);
    return news;
  }

  // Company metrics methods
  async getAllCompanyMetrics(): Promise<CompanyMetrics[]> {
    return Array.from(this.companyMetrics.values());
  }

  async getCompanyMetricsBySymbol(symbol: string): Promise<CompanyMetrics | undefined> {
    return Array.from(this.companyMetrics.values()).find(metrics => metrics.symbol === symbol);
  }

  async createCompanyMetrics(insertMetrics: InsertCompanyMetrics): Promise<CompanyMetrics> {
    const id = randomUUID();
    const metrics: CompanyMetrics = { ...insertMetrics, id };
    this.companyMetrics.set(id, metrics);
    return metrics;
  }

  // Economic indicators methods
  async getAllEconomicIndicators(): Promise<EconomicIndicators[]> {
    return Array.from(this.economicIndicators.values());
  }

  async createEconomicIndicator(insertIndicator: InsertEconomicIndicators): Promise<EconomicIndicators> {
    const id = randomUUID();
    const indicator: EconomicIndicators = {
      ...insertIndicator,
      id,
      updatedAt: new Date()
    };
    this.economicIndicators.set(id, indicator);
    return indicator;
  }

  private initializeSampleDataSync() {
    // Sample market data
    const sampleMarketData = [
      { symbol: "AAPL", name: "Apple Inc.", price: "182.52", change: "2.34", changePercent: "1.30", volume: 45672000, marketCap: "2850000000000", sector: "Technology" },
      { symbol: "MSFT", name: "Microsoft Corporation", price: "378.85", change: "-1.24", changePercent: "-0.33", volume: 32145000, marketCap: "2810000000000", sector: "Technology" },
      { symbol: "GOOGL", name: "Alphabet Inc.", price: "138.21", change: "0.89", changePercent: "0.65", volume: 28934000, marketCap: "1750000000000", sector: "Technology" },
      { symbol: "AMZN", name: "Amazon.com Inc.", price: "145.86", change: "-0.52", changePercent: "-0.36", volume: 41287000, marketCap: "1520000000000", sector: "Consumer Discretionary" },
      { symbol: "TSLA", name: "Tesla Inc.", price: "248.42", change: "12.18", changePercent: "5.15", volume: 67834000, marketCap: "789000000000", sector: "Consumer Discretionary" }
    ];

    for (const data of sampleMarketData) {
      const id = randomUUID();
      const marketEntry: MarketData = { 
        ...data,
        marketCap: data.marketCap ?? null,
        sector: data.sector ?? null,
        id, 
        updatedAt: new Date()
      };
      this.marketData.set(id, marketEntry);
    }

    // Sample business news
    const sampleNews = [
      { headline: "Fed Signals Potential Rate Cut Next Quarter", summary: "Federal Reserve officials indicated in recent statements that they may consider lowering interest rates in the coming quarter to support economic growth amid global uncertainties.", category: "Monetary Policy", importance: "high", source: "Federal Reserve" },
      { headline: "Tech Giants Report Strong Q3 Earnings", summary: "Major technology companies exceeded analyst expectations this quarter, driven by AI investments and cloud computing growth.", category: "Earnings", importance: "medium", source: "Financial Times" },
      { headline: "Global Supply Chain Disruptions Ease", summary: "International shipping delays have decreased significantly as ports implement new efficiency measures and trade routes stabilize.", category: "Supply Chain", importance: "medium", source: "Reuters" },
      { headline: "Energy Sector Sees Major M&A Activity", summary: "Several large energy companies announced consolidation plans this week, signaling a shift toward renewable energy investments.", category: "Mergers & Acquisitions", importance: "high", source: "Bloomberg" },
      { headline: "Inflation Data Shows Continued Moderation", summary: "Consumer price index data released today shows inflation continuing its downward trend, raising optimism for economic stability.", category: "Economic Data", importance: "high", source: "Bureau of Labor Statistics" }
    ];

    for (const news of sampleNews) {
      const id = randomUUID();
      const newsEntry: BusinessNews = {
        ...news,
        id,
        publishedAt: new Date()
      };
      this.businessNews.set(id, newsEntry);
    }

    // Sample company metrics
    const sampleCompanies = [
      { companyName: "Apple Inc.", symbol: "AAPL", revenue: "394328000000", profit: "99803000000", employees: 164000, industry: "Technology Hardware", headquarters: "Cupertino, CA", description: "Designs, manufactures, and markets consumer electronics, computer software, and online services.", keyMetrics: '{"peRatio": 29.1, "dividendYield": 0.44, "debtToEquity": 1.73, "returnOnEquity": 175.1}' },
      { companyName: "Microsoft Corporation", symbol: "MSFT", revenue: "211915000000", profit: "72361000000", employees: 221000, industry: "Software Infrastructure", headquarters: "Redmond, WA", description: "Develops, licenses, and supports software, services, devices, and solutions worldwide.", keyMetrics: '{"peRatio": 34.2, "dividendYield": 0.72, "debtToEquity": 0.31, "returnOnEquity": 44.5}' },
      { companyName: "Alphabet Inc.", symbol: "GOOGL", revenue: "307394000000", profit: "73795000000", employees: 182502, industry: "Internet Content & Information", headquarters: "Mountain View, CA", description: "Provides online advertising services and cloud computing platforms.", keyMetrics: '{"peRatio": 23.7, "dividendYield": 0.0, "debtToEquity": 0.11, "returnOnEquity": 27.8}' }
    ];

    for (const company of sampleCompanies) {
      const id = randomUUID();
      const companyEntry: CompanyMetrics = { ...company, id };
      this.companyMetrics.set(id, companyEntry);
    }

    // Sample economic indicators
    const sampleIndicators = [
      { name: "GDP Growth Rate", value: "2.4", unit: "%", change: "0.1", period: "Q3 2024" },
      { name: "Unemployment Rate", value: "3.7", unit: "%", change: "-0.1", period: "September 2024" },
      { name: "Inflation Rate", value: "3.2", unit: "%", change: "-0.3", period: "September 2024" },
      { name: "10-Year Treasury Yield", value: "4.28", unit: "%", change: "0.05", period: "Current" },
      { name: "Consumer Confidence Index", value: "102.6", unit: "Index", change: "2.3", period: "September 2024" }
    ];

    for (const indicator of sampleIndicators) {
      const id = randomUUID();
      const indicatorEntry: EconomicIndicators = {
        ...indicator,
        id,
        updatedAt: new Date()
      };
      this.economicIndicators.set(id, indicatorEntry);
    }
  }
}

export const storage = new MemStorage();
