import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { ReportsWrapper } from "@/components/reports/reports-wrapper"
import ReportChartsWrapper from './report-charts-wrapper'

export default async function ReportsPage() {
  const session = await requireRole(["admin", "manager"])
  const supabase = await createClient()

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
    <ReportsWrapper 
      loftRevenue={loftRevenue} 
      monthlyRevenue={monthlyRevenue}
    />
  )
}
