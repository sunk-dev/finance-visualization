export interface CorpInfo {
  c: string; // corp_code
  n: string; // corp_name
  e: string; // corp_eng_name
  s: string; // stock_code
}

export interface FinancialItem {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  stock_code: string;
  fs_div: 'CFS' | 'OFS'; // Consolidated or Separate
  fs_nm: string;
  sj_div: 'BS' | 'IS'; // Balance Sheet or Income Statement
  sj_nm: string;
  account_nm: string;
  thstrm_nm: string;
  thstrm_dt: string;
  thstrm_amount: string;
  frmtrm_nm: string;
  frmtrm_dt: string;
  frmtrm_amount: string;
  bfefrmtrm_nm: string;
  bfefrmtrm_dt: string;
  bfefrmtrm_amount: string;
  ord: string;
  currency: string;
}

export interface FinancialData {
  status: string;
  message: string;
  list: FinancialItem[];
}

export interface ChartData {
  year: string;
  revenue?: number;
  operatingProfit?: number;
  netIncome?: number;
  currentAssets?: number;
  nonCurrentAssets?: number;
  currentLiabilities?: number;
  nonCurrentLiabilities?: number;
  equity?: number;
}

export interface AIAnalysisRequest {
  financialData: ChartData[];
  companyName: string;
  year: string;
  fsDiv: 'CFS' | 'OFS';
}

export interface AIAnalysisResponse {
  analysis: string;
  summary: string;
  keyInsights: string[];
}
