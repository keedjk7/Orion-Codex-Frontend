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
  type InsertCashFlowStatement,
  type PlAccount,
  type InsertPlAccount,
  type IoMapping,
  type InsertIoMapping
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
  getProfitLossStatementsFiltered(topic?: string, startPeriod?: string, endPeriod?: string): Promise<ProfitLossStatement[]>;
  createProfitLossStatement(statement: InsertProfitLossStatement): Promise<ProfitLossStatement>;
  updateProfitLossStatement(id: string, statement: Partial<InsertProfitLossStatement>): Promise<ProfitLossStatement | undefined>;
  
  // Balance Sheet
  getAllBalanceSheets(): Promise<BalanceSheet[]>;
  getBalanceSheetsByTopic(topic: string): Promise<BalanceSheet[]>;
  getBalanceSheetsByPeriod(period: string): Promise<BalanceSheet[]>;
  getBalanceSheetsFiltered(topic?: string, startPeriod?: string, endPeriod?: string): Promise<BalanceSheet[]>;
  createBalanceSheet(sheet: InsertBalanceSheet): Promise<BalanceSheet>;
  updateBalanceSheet(id: string, sheet: Partial<InsertBalanceSheet>): Promise<BalanceSheet | undefined>;
  
  // Cash Flow
  getAllCashFlowStatements(): Promise<CashFlowStatement[]>;
  getCashFlowStatementsByTopic(topic: string): Promise<CashFlowStatement[]>;
  getCashFlowStatementsByPeriod(period: string): Promise<CashFlowStatement[]>;
  getCashFlowStatementsFiltered(topic?: string, startPeriod?: string, endPeriod?: string): Promise<CashFlowStatement[]>;
  createCashFlowStatement(statement: InsertCashFlowStatement): Promise<CashFlowStatement>;
  updateCashFlowStatement(id: string, statement: Partial<InsertCashFlowStatement>): Promise<CashFlowStatement | undefined>;
  
  // PL Account methods
  getAllPlAccounts(): Promise<PlAccount[]>;
  getPlAccountById(id: string): Promise<PlAccount | undefined>;
  searchPlAccounts(query: string): Promise<PlAccount[]>;
  createPlAccount(account: InsertPlAccount): Promise<PlAccount>;
  updatePlAccount(id: string, account: Partial<InsertPlAccount>): Promise<PlAccount | undefined>;
  deletePlAccount(id: string): Promise<boolean>;
  
  // IO Mapping methods
  getAllIoMappings(): Promise<IoMapping[]>;
  getIoMappingById(id: string): Promise<IoMapping | undefined>;
  createIoMapping(mapping: InsertIoMapping): Promise<IoMapping>;
  updateIoMapping(id: string, mapping: Partial<InsertIoMapping>): Promise<IoMapping | undefined>;
  deleteIoMapping(id: string): Promise<boolean>;
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
  private plAccounts: Map<string, PlAccount>;
  private ioMappings: Map<string, IoMapping>;

  constructor() {
    this.users = new Map();
    this.marketData = new Map();
    this.businessNews = new Map();
    this.companyMetrics = new Map();
    this.economicIndicators = new Map();
    this.profitLossStatements = new Map();
    this.balanceSheets = new Map();
    this.cashFlowStatements = new Map();
    this.plAccounts = new Map();
    this.ioMappings = new Map();
    
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

  async getProfitLossStatementsFiltered(topic?: string, startPeriod?: string, endPeriod?: string): Promise<ProfitLossStatement[]> {
    let statements = Array.from(this.profitLossStatements.values());
    if (topic) {
      statements = statements.filter(statement => statement.topic === topic);
    }
    if (startPeriod) {
      statements = statements.filter(statement => statement.period >= startPeriod);
    }
    if (endPeriod) {
      statements = statements.filter(statement => statement.period <= endPeriod);
    }
    return statements;
  }

  async createProfitLossStatement(insertStatement: InsertProfitLossStatement): Promise<ProfitLossStatement> {
    const id = randomUUID();
    const statement: ProfitLossStatement = {
      ...insertStatement,
      otherIncome: insertStatement.otherIncome ?? "0",
      otherExpenses: insertStatement.otherExpenses ?? "0",
      isEditable: insertStatement.isEditable ?? "true",
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

  async getBalanceSheetsFiltered(topic?: string, startPeriod?: string, endPeriod?: string): Promise<BalanceSheet[]> {
    let sheets = Array.from(this.balanceSheets.values());
    if (topic) {
      sheets = sheets.filter(sheet => sheet.topic === topic);
    }
    if (startPeriod) {
      sheets = sheets.filter(sheet => sheet.period >= startPeriod);
    }
    if (endPeriod) {
      sheets = sheets.filter(sheet => sheet.period <= endPeriod);
    }
    return sheets;
  }

  async createBalanceSheet(insertSheet: InsertBalanceSheet): Promise<BalanceSheet> {
    const id = randomUUID();
    const sheet: BalanceSheet = {
      ...insertSheet,
      isEditable: insertSheet.isEditable ?? "true",
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

  async getCashFlowStatementsFiltered(topic?: string, startPeriod?: string, endPeriod?: string): Promise<CashFlowStatement[]> {
    let statements = Array.from(this.cashFlowStatements.values());
    if (topic) {
      statements = statements.filter(statement => statement.topic === topic);
    }
    if (startPeriod) {
      statements = statements.filter(statement => statement.period >= startPeriod);
    }
    if (endPeriod) {
      statements = statements.filter(statement => statement.period <= endPeriod);
    }
    return statements;
  }

  async createCashFlowStatement(insertStatement: InsertCashFlowStatement): Promise<CashFlowStatement> {
    const id = randomUUID();
    const statement: CashFlowStatement = {
      ...insertStatement,
      acquisitions: insertStatement.acquisitions ?? "0",
      debtIssuance: insertStatement.debtIssuance ?? "0",
      debtRepayment: insertStatement.debtRepayment ?? "0",
      dividendsPaid: insertStatement.dividendsPaid ?? "0",
      isEditable: insertStatement.isEditable ?? "true",
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
    // Sample P&L data - 12 months
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-03",
        totalRevenue: "5300000.00",
        costOfGoodsSold: "3150000.00",
        grossProfit: "2150000.00",
        operatingExpenses: "1300000.00",
        operatingIncome: "850000.00",
        otherIncome: "40000.00",
        otherExpenses: "18000.00",
        netIncomeBeforeTax: "872000.00",
        taxExpense: "174400.00",
        netIncome: "697600.00",
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
        period: "2024-04",
        totalRevenue: "5500000.00",
        costOfGoodsSold: "3200000.00",
        grossProfit: "2300000.00",
        operatingExpenses: "1320000.00",
        operatingIncome: "980000.00",
        otherIncome: "35000.00",
        otherExpenses: "22000.00",
        netIncomeBeforeTax: "993000.00",
        taxExpense: "198600.00",
        netIncome: "794400.00",
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
        period: "2024-05",
        totalRevenue: "5400000.00",
        costOfGoodsSold: "3180000.00",
        grossProfit: "2220000.00",
        operatingExpenses: "1280000.00",
        operatingIncome: "940000.00",
        otherIncome: "45000.00",
        otherExpenses: "25000.00",
        netIncomeBeforeTax: "960000.00",
        taxExpense: "192000.00",
        netIncome: "768000.00",
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
        period: "2024-06",
        totalRevenue: "5600000.00",
        costOfGoodsSold: "3250000.00",
        grossProfit: "2350000.00",
        operatingExpenses: "1350000.00",
        operatingIncome: "1000000.00",
        otherIncome: "55000.00",
        otherExpenses: "30000.00",
        netIncomeBeforeTax: "1025000.00",
        taxExpense: "205000.00",
        netIncome: "820000.00",
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
        period: "2024-07",
        totalRevenue: "5800000.00",
        costOfGoodsSold: "3300000.00",
        grossProfit: "2500000.00",
        operatingExpenses: "1400000.00",
        operatingIncome: "1100000.00",
        otherIncome: "42000.00",
        otherExpenses: "28000.00",
        netIncomeBeforeTax: "1114000.00",
        taxExpense: "222800.00",
        netIncome: "891200.00",
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
        period: "2024-08",
        totalRevenue: "5700000.00",
        costOfGoodsSold: "3280000.00",
        grossProfit: "2420000.00",
        operatingExpenses: "1380000.00",
        operatingIncome: "1040000.00",
        otherIncome: "38000.00",
        otherExpenses: "26000.00",
        netIncomeBeforeTax: "1052000.00",
        taxExpense: "210400.00",
        netIncome: "841600.00",
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
        period: "2024-09",
        totalRevenue: "5900000.00",
        costOfGoodsSold: "3350000.00",
        grossProfit: "2550000.00",
        operatingExpenses: "1420000.00",
        operatingIncome: "1130000.00",
        otherIncome: "48000.00",
        otherExpenses: "32000.00",
        netIncomeBeforeTax: "1146000.00",
        taxExpense: "229200.00",
        netIncome: "916800.00",
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
        period: "2024-10",
        totalRevenue: "6000000.00",
        costOfGoodsSold: "3400000.00",
        grossProfit: "2600000.00",
        operatingExpenses: "1450000.00",
        operatingIncome: "1150000.00",
        otherIncome: "52000.00",
        otherExpenses: "35000.00",
        netIncomeBeforeTax: "1167000.00",
        taxExpense: "233400.00",
        netIncome: "933600.00",
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
        period: "2024-11",
        totalRevenue: "6200000.00",
        costOfGoodsSold: "3480000.00",
        grossProfit: "2720000.00",
        operatingExpenses: "1480000.00",
        operatingIncome: "1240000.00",
        otherIncome: "58000.00",
        otherExpenses: "38000.00",
        netIncomeBeforeTax: "1260000.00",
        taxExpense: "252000.00",
        netIncome: "1008000.00",
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
        period: "2024-12",
        totalRevenue: "6500000.00",
        costOfGoodsSold: "3600000.00",
        grossProfit: "2900000.00",
        operatingExpenses: "1550000.00",
        operatingIncome: "1350000.00",
        otherIncome: "65000.00",
        otherExpenses: "42000.00",
        netIncomeBeforeTax: "1373000.00",
        taxExpense: "274600.00",
        netIncome: "1098400.00",
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

    // Sample Balance Sheet data - 12 months
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-02",
        currentAssets: "8200000.00",
        cash: "2200000.00",
        accountsReceivable: "3100000.00",
        inventory: "2900000.00",
        nonCurrentAssets: "15150000.00",
        propertyPlantEquipment: "12150000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "23350000.00",
        currentLiabilities: "4050000.00",
        accountsPayable: "2050000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7950000.00",
        longTermDebt: "7950000.00",
        totalLiabilities: "12000000.00",
        shareholdersEquity: "11350000.00",
        retainedEarnings: "6350000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-03",
        currentAssets: "8450000.00",
        cash: "2450000.00",
        accountsReceivable: "3150000.00",
        inventory: "2850000.00",
        nonCurrentAssets: "15300000.00",
        propertyPlantEquipment: "12300000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "23750000.00",
        currentLiabilities: "4100000.00",
        accountsPayable: "2100000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7900000.00",
        longTermDebt: "7900000.00",
        totalLiabilities: "12000000.00",
        shareholdersEquity: "11750000.00",
        retainedEarnings: "6750000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-04",
        currentAssets: "8750000.00",
        cash: "2750000.00",
        accountsReceivable: "3250000.00",
        inventory: "2750000.00",
        nonCurrentAssets: "15500000.00",
        propertyPlantEquipment: "12500000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "24250000.00",
        currentLiabilities: "4200000.00",
        accountsPayable: "2200000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7850000.00",
        longTermDebt: "7850000.00",
        totalLiabilities: "12050000.00",
        shareholdersEquity: "12200000.00",
        retainedEarnings: "7200000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-05",
        currentAssets: "8950000.00",
        cash: "2950000.00",
        accountsReceivable: "3200000.00",
        inventory: "2800000.00",
        nonCurrentAssets: "15700000.00",
        propertyPlantEquipment: "12700000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "24650000.00",
        currentLiabilities: "4250000.00",
        accountsPayable: "2250000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7800000.00",
        longTermDebt: "7800000.00",
        totalLiabilities: "12050000.00",
        shareholdersEquity: "12600000.00",
        retainedEarnings: "7600000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-06",
        currentAssets: "9200000.00",
        cash: "3200000.00",
        accountsReceivable: "3300000.00",
        inventory: "2700000.00",
        nonCurrentAssets: "15900000.00",
        propertyPlantEquipment: "12900000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "25100000.00",
        currentLiabilities: "4300000.00",
        accountsPayable: "2300000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7750000.00",
        longTermDebt: "7750000.00",
        totalLiabilities: "12050000.00",
        shareholdersEquity: "13050000.00",
        retainedEarnings: "8050000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-07",
        currentAssets: "9500000.00",
        cash: "3500000.00",
        accountsReceivable: "3400000.00",
        inventory: "2600000.00",
        nonCurrentAssets: "16100000.00",
        propertyPlantEquipment: "13100000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "25600000.00",
        currentLiabilities: "4400000.00",
        accountsPayable: "2400000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7700000.00",
        longTermDebt: "7700000.00",
        totalLiabilities: "12100000.00",
        shareholdersEquity: "13500000.00",
        retainedEarnings: "8500000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-08",
        currentAssets: "9750000.00",
        cash: "3750000.00",
        accountsReceivable: "3350000.00",
        inventory: "2650000.00",
        nonCurrentAssets: "16250000.00",
        propertyPlantEquipment: "13250000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "26000000.00",
        currentLiabilities: "4450000.00",
        accountsPayable: "2450000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7650000.00",
        longTermDebt: "7650000.00",
        totalLiabilities: "12100000.00",
        shareholdersEquity: "13900000.00",
        retainedEarnings: "8900000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-09",
        currentAssets: "10000000.00",
        cash: "4000000.00",
        accountsReceivable: "3500000.00",
        inventory: "2500000.00",
        nonCurrentAssets: "16500000.00",
        propertyPlantEquipment: "13500000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "26500000.00",
        currentLiabilities: "4500000.00",
        accountsPayable: "2500000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7600000.00",
        longTermDebt: "7600000.00",
        totalLiabilities: "12100000.00",
        shareholdersEquity: "14400000.00",
        retainedEarnings: "9400000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-10",
        currentAssets: "10350000.00",
        cash: "4350000.00",
        accountsReceivable: "3600000.00",
        inventory: "2400000.00",
        nonCurrentAssets: "16750000.00",
        propertyPlantEquipment: "13750000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "27100000.00",
        currentLiabilities: "4600000.00",
        accountsPayable: "2600000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7550000.00",
        longTermDebt: "7550000.00",
        totalLiabilities: "12150000.00",
        shareholdersEquity: "14950000.00",
        retainedEarnings: "9950000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-11",
        currentAssets: "10700000.00",
        cash: "4700000.00",
        accountsReceivable: "3700000.00",
        inventory: "2300000.00",
        nonCurrentAssets: "17000000.00",
        propertyPlantEquipment: "14000000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "27700000.00",
        currentLiabilities: "4700000.00",
        accountsPayable: "2700000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7500000.00",
        longTermDebt: "7500000.00",
        totalLiabilities: "12200000.00",
        shareholdersEquity: "15500000.00",
        retainedEarnings: "10500000.00",
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-12",
        currentAssets: "11150000.00",
        cash: "5150000.00",
        accountsReceivable: "3800000.00",
        inventory: "2200000.00",
        nonCurrentAssets: "17300000.00",
        propertyPlantEquipment: "14300000.00",
        intangibleAssets: "3000000.00",
        totalAssets: "28450000.00",
        currentLiabilities: "4800000.00",
        accountsPayable: "2800000.00",
        shortTermDebt: "2000000.00",
        longTermLiabilities: "7450000.00",
        longTermDebt: "7450000.00",
        totalLiabilities: "12250000.00",
        shareholdersEquity: "16200000.00",
        retainedEarnings: "11200000.00",
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

    // Sample Cash Flow data - 12 months
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
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-02",
        operatingCashFlow: "950000.00",
        netIncome: "692000.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "-42000.00",
        investingCashFlow: "-600000.00",
        capitalExpenditures: "-600000.00",
        acquisitions: "0.00",
        financingCashFlow: "-150000.00",
        debtIssuance: "0.00",
        debtRepayment: "-50000.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "200000.00",
        beginningCashBalance: "2000000.00",
        endingCashBalance: "2200000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-03",
        operatingCashFlow: "970000.00",
        netIncome: "697600.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "-27600.00",
        investingCashFlow: "-620000.00",
        capitalExpenditures: "-620000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "250000.00",
        beginningCashBalance: "2200000.00",
        endingCashBalance: "2450000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-04",
        operatingCashFlow: "1080000.00",
        netIncome: "794400.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "-14400.00",
        investingCashFlow: "-680000.00",
        capitalExpenditures: "-680000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "300000.00",
        beginningCashBalance: "2450000.00",
        endingCashBalance: "2750000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-05",
        operatingCashFlow: "1050000.00",
        netIncome: "768000.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "-18000.00",
        investingCashFlow: "-750000.00",
        capitalExpenditures: "-750000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "200000.00",
        beginningCashBalance: "2750000.00",
        endingCashBalance: "2950000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-06",
        operatingCashFlow: "1120000.00",
        netIncome: "820000.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "0.00",
        investingCashFlow: "-770000.00",
        capitalExpenditures: "-770000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "250000.00",
        beginningCashBalance: "2950000.00",
        endingCashBalance: "3200000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-07",
        operatingCashFlow: "1200000.00",
        netIncome: "891200.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "8800.00",
        investingCashFlow: "-800000.00",
        capitalExpenditures: "-800000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "300000.00",
        beginningCashBalance: "3200000.00",
        endingCashBalance: "3500000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-08",
        operatingCashFlow: "1150000.00",
        netIncome: "841600.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "8400.00",
        investingCashFlow: "-800000.00",
        capitalExpenditures: "-800000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "250000.00",
        beginningCashBalance: "3500000.00",
        endingCashBalance: "3750000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-09",
        operatingCashFlow: "1230000.00",
        netIncome: "916800.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "13200.00",
        investingCashFlow: "-880000.00",
        capitalExpenditures: "-880000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "250000.00",
        beginningCashBalance: "3750000.00",
        endingCashBalance: "4000000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-10",
        operatingCashFlow: "1280000.00",
        netIncome: "933600.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "46400.00",
        investingCashFlow: "-830000.00",
        capitalExpenditures: "-830000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "350000.00",
        beginningCashBalance: "4000000.00",
        endingCashBalance: "4350000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-11",
        operatingCashFlow: "1350000.00",
        netIncome: "1008000.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "42000.00",
        investingCashFlow: "-900000.00",
        capitalExpenditures: "-900000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "350000.00",
        beginningCashBalance: "4350000.00",
        endingCashBalance: "4700000.00",
        isEditable: JSON.stringify({
          netIncome: false,
          depreciation: true,
          capitalExpenditures: true,
          debtRepayment: true,
          dividendsPaid: true,
          operatingCashFlow: false,
          netChangeInCash: false
        })
      },
      {
        topic: "บริษัท ABC จำกัด",
        period: "2024-12",
        operatingCashFlow: "1450000.00",
        netIncome: "1098400.00",
        depreciation: "300000.00",
        changeInWorkingCapital: "51600.00",
        investingCashFlow: "-900000.00",
        capitalExpenditures: "-900000.00",
        acquisitions: "0.00",
        financingCashFlow: "-100000.00",
        debtIssuance: "0.00",
        debtRepayment: "-0.00",
        dividendsPaid: "-100000.00",
        netChangeInCash: "450000.00",
        beginningCashBalance: "4700000.00",
        endingCashBalance: "5150000.00",
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

    // Initialize PL Accounts
    const mockPlAccounts = [
      {
        plAccount: "Revenue - Sales"
      },
      {
        plAccount: "Cost of Goods Sold"
      },
      {
        plAccount: "Operating Expenses"
      },
      {
        plAccount: "Marketing & Advertising"
      },
      {
        plAccount: "Research & Development"
      }
    ];

    for (const accountData of mockPlAccounts) {
      const id = randomUUID();
      const account: PlAccount = {
        id,
        ...accountData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.plAccounts.set(id, account);
    }

    // Initialize IO Mappings
    const plAccountsArray = Array.from(this.plAccounts.values());
    const mockIoMappings = [
      {
        description: "Sales revenue from e-commerce platform",
        accountId: plAccountsArray[0].id
      },
      {
        description: "Direct material costs for production", 
        accountId: plAccountsArray[1].id
      },
      {
        description: "Office rent and utilities",
        accountId: plAccountsArray[2].id
      },
      {
        description: "Digital marketing campaigns",
        accountId: plAccountsArray[3].id
      }
    ];

    for (const mappingData of mockIoMappings) {
      const id = randomUUID();
      const mapping: IoMapping = {
        id,
        ...mappingData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.ioMappings.set(id, mapping);
    }
  }

  // PL Account methods
  async getAllPlAccounts(): Promise<PlAccount[]> {
    return Array.from(this.plAccounts.values());
  }

  async getPlAccountById(id: string): Promise<PlAccount | undefined> {
    return this.plAccounts.get(id);
  }

  async searchPlAccounts(query: string): Promise<PlAccount[]> {
    const allAccounts = Array.from(this.plAccounts.values());
    return allAccounts.filter(account => 
      account.plAccount.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createPlAccount(accountData: InsertPlAccount): Promise<PlAccount> {
    const id = randomUUID();
    const account: PlAccount = {
      id,
      ...accountData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.plAccounts.set(id, account);
    return account;
  }

  async updatePlAccount(id: string, updates: Partial<InsertPlAccount>): Promise<PlAccount | undefined> {
    const existing = this.plAccounts.get(id);
    if (!existing) return undefined;

    const updated: PlAccount = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.plAccounts.set(id, updated);
    return updated;
  }

  async deletePlAccount(id: string): Promise<boolean> {
    return this.plAccounts.delete(id);
  }

  // IO Mapping methods
  async getAllIoMappings(): Promise<IoMapping[]> {
    return Array.from(this.ioMappings.values());
  }

  async getIoMappingById(id: string): Promise<IoMapping | undefined> {
    return this.ioMappings.get(id);
  }

  async createIoMapping(mappingData: InsertIoMapping): Promise<IoMapping> {
    const id = randomUUID();
    const mapping: IoMapping = {
      id,
      ...mappingData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ioMappings.set(id, mapping);
    return mapping;
  }

  async updateIoMapping(id: string, updates: Partial<InsertIoMapping>): Promise<IoMapping | undefined> {
    const existing = this.ioMappings.get(id);
    if (!existing) return undefined;

    const updated: IoMapping = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.ioMappings.set(id, updated);
    return updated;
  }

  async deleteIoMapping(id: string): Promise<boolean> {
    return this.ioMappings.delete(id);
  }
}

export const storage = new MemStorage();
