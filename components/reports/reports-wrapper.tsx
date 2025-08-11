"use client"

import { useTranslation } from "@/lib/i18n/context"
import ReportChartsWrapper from '@/app/reports/report-charts-wrapper'

interface LoftRevenue {
  name: string
  revenue: number
  expenses: number
  net_profit: number
}

interface ReportsWrapperProps {
  loftRevenue: LoftRevenue[]
  monthlyRevenue: any[]
}

export function ReportsWrapper({ loftRevenue, monthlyRevenue }: ReportsWrapperProps) {
  const { t } = useTranslation(["common", "analytics"]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
        <p className="text-muted-foreground">{t('analytics.subtitle')}</p>
      </div>

      <ReportChartsWrapper loftRevenue={loftRevenue} monthlyRevenue={monthlyRevenue} />
    </div>
  )
}