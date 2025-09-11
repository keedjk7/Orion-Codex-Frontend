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
  type InsertEconomicIndicators,
  type ProfitLossStatement,
  type InsertProfitLossStatement,
  type BalanceSheet,
  type InsertBalanceSheet,
  type CashFlowStatement,
  type InsertCashFlowStatement
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
  
  // Financial Reports methods
  // Profit & Loss
  getAllProfitLossStatements(): Promise<ProfitLossStatement[]>;
  getProfitLossStatementsByTopic(topic: string): Promise<ProfitLossStatement[]>;
  getProfitLossStatementsByPeriod(period: string): Promise<ProfitLossStatement[]>;
  getProfitLossStatementsFiltered(topic?: string, period?: string): Promise<ProfitLossStatement[]>;
  createProfitLossStatement(statement: InsertProfitLossStatement): Promise<ProfitLossStatement>;
  updateProfitLossStatement(id: string, statement: Partial<InsertProfitLossStatement>): Promise<ProfitLossStatement | undefined>;
  
  // Balance Sheet
  getAllBalanceSheets(): Promise<BalanceSheet[]>;
  getBalanceSheetsByTopic(topic: string): Promise<BalanceSheet[]>;
  getBalanceSheetsByPeriod(period: string): Promise<BalanceSheet[]>;
  getBalanceSheetsFiltered(topic?: string, period?: string): Promise<BalanceSheet[]>;
  createBalanceSheet(sheet: InsertBalanceSheet): Promise<BalanceSheet>;
  updateBalanceSheet(id: string, sheet: Partial<InsertBalanceSheet>): Promise<BalanceSheet | undefined>;
  
  // Cash Flow
  getAllCashFlowStatements(): Promise<CashFlowStatement[]>;
  getCashFlowStatementsByTopic(topic: string): Promise<CashFlowStatement[]>;
  getCashFlowStatementsByPeriod(period: string): Promise<CashFlowStatement[]>;
  getCashFlowStatementsFiltered(topic?: string, period?: string): Promise<CashFlowStatement[]>;
  createCashFlowStatement(statement: InsertCashFlowStatement): Promise<CashFlowStatement>;
  updateCashFlowStatement(id: string, statement: Partial<InsertCashFlowStatement>): Promise<CashFlowStatement | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private marketData: Map<string, MarketData>;
  private businessNews: Map<string, BusinessNews>;
  private companyMetrics: Map<string, CompanyMetrics>;
  private economicIndicators: Map<string, EconomicIndicators>;
  private profitLossStatements: Map<string, ProfitLossStatement>;
  private balanceSheets: Map<string, BalanceSheet>;
  private cashFlowStatements: Map<string, CashFlowStatement>;

  constructor() {
    this.users = new Map();
    this.marketData = new Map();
    this.businessNews = new Map();
    this.companyMetrics = new Map();
    this.economicIndicators = new Map();
    this.profitLossStatements = new Map();
    this.balanceSheets = new Map();
    this.cashFlowStatements = new Map();
    
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

    // Initialize sample financial reports data
    this.initializeFinancialReportsData();
  }

  // Profit & Loss Statement methods
  async getAllProfitLossStatements(): Promise<ProfitLossStatement[]> {
    return Array.from(this.profitLossStatements.values());
  }

  async getProfitLossStatementsByTopic(topic: string): Promise<ProfitLossStatement[]> {
    return Array.from(this.profitLossStatements.values()).filter(statement => statement.topic === topic);
  }

  async getProfitLossStatementsByPeriod(period: string): Promise<ProfitLossStatement[]> {
    return Array.from(this.profitLossStatements.values()).filter(statement => statement.period === period);
  }

  async getProfitLossStatementsFiltered(topic?: string, period?: string): Promise<ProfitLossStatement[]> {
    let statements = Array.from(this.profitLossStatements.values());
    if (topic) {
      statements = statements.filter(statement => statement.topic === topic);
    }
    if (period) {
      statements = statements.filter(statement => statement.period === period);
    }
    return statements;
  }

  async createProfitLossStatement(insertStatement: InsertProfitLossStatement): Promise<ProfitLossStatement> {
    const id = randomUUID();
    const statement: ProfitLossStatement = {
      ...insertStatement,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.profitLossStatements.set(id, statement);
    return statement;
  }

  async updateProfitLossStatement(id: string, updates: Partial<InsertProfitLossStatement>): Promise<ProfitLossStatement | undefined> {
    const statement = this.profitLossStatements.get(id);
    if (!statement) return undefined;
    
    const updatedStatement: ProfitLossStatement = {
      ...statement,
      ...updates,
      updatedAt: new Date()
    };
    this.profitLossStatements.set(id, updatedStatement);
    return updatedStatement;
  }

  // Balance Sheet methods
  async getAllBalanceSheets(): Promise<BalanceSheet[]> {
    return Array.from(this.balanceSheets.values());
  }

  async getBalanceSheetsByTopic(topic: string): Promise<BalanceSheet[]> {
    return Array.from(this.balanceSheets.values()).filter(sheet => sheet.topic === topic);
  }

  async getBalanceSheetsByPeriod(period: string): Promise<BalanceSheet[]> {
    return Array.from(this.balanceSheets.values()).filter(sheet => sheet.period === period);
  }

  async getBalanceSheetsFiltered(topic?: string, period?: string): Promise<BalanceSheet[]> {
    let sheets = Array.from(this.balanceSheets.values());
    if (topic) {
      sheets = sheets.filter(sheet => sheet.topic === topic);
    }
    if (period) {
      sheets = sheets.filter(sheet => sheet.period === period);
    }
    return sheets;
  }

  async createBalanceSheet(insertSheet: InsertBalanceSheet): Promise<BalanceSheet> {
    const id = randomUUID();
    const sheet: BalanceSheet = {
      ...insertSheet,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.balanceSheets.set(id, sheet);
    return sheet;
  }

  async updateBalanceSheet(id: string, updates: Partial<InsertBalanceSheet>): Promise<BalanceSheet | undefined> {
    const sheet = this.balanceSheets.get(id);
    if (!sheet) return undefined;
    
    const updatedSheet: BalanceSheet = {
      ...sheet,
      ...updates,
      updatedAt: new Date()
    };
    this.balanceSheets.set(id, updatedSheet);
    return updatedSheet;
  }

  // Cash Flow Statement methods
  async getAllCashFlowStatements(): Promise<CashFlowStatement[]> {
    return Array.from(this.cashFlowStatements.values());
  }

  async getCashFlowStatementsByTopic(topic: string): Promise<CashFlowStatement[]> {
    return Array.from(this.cashFlowStatements.values()).filter(statement => statement.topic === topic);
  }

  async getCashFlowStatementsByPeriod(period: string): Promise<CashFlowStatement[]> {
    return Array.from(this.cashFlowStatements.values()).filter(statement => statement.period === period);
  }

  async getCashFlowStatementsFiltered(topic?: string, period?: string): Promise<CashFlowStatement[]> {
    let statements = Array.from(this.cashFlowStatements.values());
    if (topic) {
      statements = statements.filter(statement => statement.topic === topic);
    }
    if (period) {
      statements = statements.filter(statement => statement.period === period);
    }
    return statements;
  }

  async createCashFlowStatement(insertStatement: InsertCashFlowStatement): Promise<CashFlowStatement> {
    const id = randomUUID();
    const statement: CashFlowStatement = {
      ...insertStatement,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cashFlowStatements.set(id, statement);
    return statement;
  }

  async updateCashFlowStatement(id: string, updates: Partial<InsertCashFlowStatement>): Promise<CashFlowStatement | undefined> {
    const statement = this.cashFlowStatements.get(id);
    if (!statement) return undefined;
    
    const updatedStatement: CashFlowStatement = {
      ...statement,
      ...updates,
      updatedAt: new Date()
    };
    this.cashFlowStatements.set(id, updatedStatement);
    return updatedStatement;
  }

  private initializeFinancialReportsData() {
    // Sample P&L data
    const samplePLData = [
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-01",
        totalRevenue: "5000000.00",
        costOfGoodsSold: "3000000.00",
        grossProfit: "2000000.00",
        operatingExpenses: "1200000.00",
        operatingIncome: "800000.00",
        otherIncome: "50000.00",
        otherExpenses: "20000.00",
        netIncomeBeforeTax: "830000.00",
        taxExpense: "166000.00",
        netIncome: "664000.00",
        isEditable: JSON.stringify({
          totalRevenue: true,
          costOfGoodsSold: true,
          operatingExpenses: true,
          grossProfit: false,
          operatingIncome: false,
          netIncomeBeforeTax: false,
          netIncome: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-02",
        totalRevenue: "5200000.00",
        costOfGoodsSold: "3100000.00",
        grossProfit: "2100000.00",
        operatingExpenses: "1250000.00",
        operatingIncome: "850000.00",
        otherIncome: "30000.00",
        otherExpenses: "15000.00",
        netIncomeBeforeTax: "865000.00",
        taxExpense: "173000.00",
        netIncome: "692000.00",
        isEditable: JSON.stringify({
          totalRevenue: true,
          costOfGoodsSold: true,
          operatingExpenses: true,
          grossProfit: false,
          operatingIncome: false,
          netIncomeBeforeTax: false,
          netIncome: false
        })
      }
    ];

    for (const data of samplePLData) {
      const id = randomUUID();
      const statement: ProfitLossStatement = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.profitLossStatements.set(id, statement);
    }

    // Sample Balance Sheet data
    const sampleBSData = [
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-01",
        currentAssets: "8000000.00",
        cash: "2000000.00",
        accountsReceivable: "3000000.00",
        inventory: "3000000.00",
        nonCurrentAssets: "15000000.00",
        propertyPlantEquipment: "12000000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "23000000.00",
        currentLiabilities: "4000000.00",
        accountsPayable: "2000000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "8000000.00",
        longTermDebt: "8000000.00",
        totalLiabilities: "12000000.00",
        shareholdersEquity: "11000000.00",
        retainedEarnings: "6000000.00",
        isEditable: JSON.stringify({
          cash: true,
          accountsReceivable: true,
          inventory: true,
          accountsPayable: true,
          shortTermDebt: true,
          currentAssets: false,
          totalAssets: false,
          totalLiabilities: false
        })
      }
    ];

    for (const data of sampleBSData) {
      const id = randomUUID();
      const sheet: BalanceSheet = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.balanceSheets.set(id, sheet);
    }

    // Sample Cash Flow data
    const sampleCFData = [
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-01",
        operatingCashFlow: "900000.00",
        netIncome: "664000.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "-64000.00",
        investingCashFlow: "-500000.00",
        capitalExpenditures: "-500000.00",
        acquisitions: "0.00",
        financingCashFlow: "-200000.00",
        debtIssuance: "0.00",
        debtRepayment: "-100000.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "200000.00",
        beginningCashBalance: "1800000.00",
        endingCashBalance: "2000000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      }
    ];

    for (const data of sampleCFData) {
      const id = randomUUID();
      const statement: CashFlowStatement = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.cashFlowStatements.set(id, statement);
    }
  }
}

export const storage = new MemStorage();
