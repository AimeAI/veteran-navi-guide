
export interface JobVariant {
  id: string;
  jobId: string;
  title: string;
  description: string;
  callToAction: string;
  isControl: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface VariantPerformance {
  variantId: string;
  views: number;
  clicks: number;
  applications: number;
  conversionRate: number; // applications / views
}

export interface AbTestResult {
  jobId: string;
  variants: JobVariant[];
  performance: VariantPerformance[];
  startDate: string;
  endDate?: string;
  winningVariantId?: string;
  status: 'running' | 'completed' | 'paused';
}
