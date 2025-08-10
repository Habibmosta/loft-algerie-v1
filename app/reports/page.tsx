"use client"

import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import ReportChartsWrapper from './report-charts-wrapper'

export default async function ReportsPage() {
  const session = await requireRole(["admin", "manager"])
  const supabase = await createClient()
  const { t } = useTranslation()

  // Fetch financial data by loft
  const { data: lofts, error: loftsError } = await supabase
    .from("lofts")
    .select("*, transactions(*)")

  if (loftsError) {
    throw new Error(loftsError.message)
  }

  const loftRevenue = lofts.map((loft: any) => {
    const revenue = loft.transactions
      .filter((transaction: any) => transaction.transaction_type === "income" && transaction.status === "completed")
      .reduce((acc: number, transaction: any) => acc + transaction.amount, 0)
    const expenses = loft.transactions
      .filter((transaction: any) => transaction.transaction_type === "expense" && transaction.status === "completed")
      .reduce((acc: number, transaction: any) => acc + transaction.amount, 0)
    return {
      name: loft.name,
      revenue,
      expenses,
      net_profit: revenue - expenses,
    }
  })

  // Fetch monthly revenue trend
  const { data: monthlyRevenue, error: monthlyRevenueError } = await supabase.rpc(
    "calculate_monthly_revenue"
  )

  if (monthlyRevenueError) {
    throw new Error(monthlyRevenueError.message)
  }

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
