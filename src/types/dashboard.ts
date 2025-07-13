export interface MTTRBreakdown {
  below_1_hour: number;
  hour_1_to_4: number;
  hour_4_to_8: number;
  hour_8_to_24: number;
  above_24_hour: number;
}

export interface CategoryData {
  total: number;
  mttr_breakdown: MTTRBreakdown;
}

export interface DivisionData {
  oos: CategoryData;
  others: CategoryData;
}

export interface DashboardResponse {
  total_tickets: number;
  enterprise: DivisionData;
  partnership: DivisionData;
}
