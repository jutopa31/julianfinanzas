// Types de la aplicación JulianFinanzas

export type FrequencyType = 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export type AssetType = 'property' | 'vehicle' | 'equipment' | 'digital' | 'other';

export interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
  rate_to_usd: number;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  default_currency_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  name: string;
  invested_amount: number;
  current_value: number;
  currency_id: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  return_percentage: number; // Campo calculado
  currency?: Currency; // Joined data
}

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  asset_type: AssetType | null;
  current_value: number;
  currency_id: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  currency?: Currency; // Joined data
}

export interface IncomeSchedule {
  id: string;
  user_id: string;
  concept: string;
  amount: number;
  currency_id: string;
  expected_date: string; // DATE format: YYYY-MM-DD
  is_received: boolean;
  received_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  currency?: Currency; // Joined data
}

export interface ExpenseSchedule {
  id: string;
  user_id: string;
  concept: string;
  amount: number;
  currency_id: string;
  frequency: FrequencyType;
  next_due_date: string; // DATE format: YYYY-MM-DD
  last_generated_date: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  currency?: Currency; // Joined data
}

export interface ExpenseRecord {
  id: string;
  user_id: string;
  expense_schedule_id: string | null;
  concept: string;
  amount: number;
  currency_id: string;
  due_date: string; // DATE format: YYYY-MM-DD
  is_paid: boolean;
  paid_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  currency?: Currency; // Joined data
}

// Form Types (para React Hook Form)
export interface InvestmentFormData {
  name: string;
  invested_amount: number;
  current_value: number;
  currency_id: string;
  notes?: string;
}

export interface AssetFormData {
  name: string;
  asset_type?: AssetType;
  current_value: number;
  currency_id: string;
  description?: string;
}

export interface IncomeFormData {
  concept: string;
  amount: number;
  currency_id: string;
  expected_date: Date;
  notes?: string;
}

export interface ExpenseScheduleFormData {
  concept: string;
  amount: number;
  currency_id: string;
  frequency: FrequencyType;
  next_due_date: Date;
  notes?: string;
}

// Dashboard Types
export interface CashflowSummary {
  totalInvestments: number;
  totalAssets: number;
  pendingIncome: number;
  upcomingExpenses: number;
  netWorth: number;
  cashflowProjection: number;
  defaultCurrency: Currency;
}

export interface UpcomingEvent {
  id: string;
  type: 'income' | 'expense';
  concept: string;
  amount: number;
  date: string;
  currency: Currency;
  is_paid?: boolean;
  is_received?: boolean;
}
