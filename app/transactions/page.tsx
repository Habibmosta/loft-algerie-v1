import { requireRole } from "@/lib/auth"
import { getTransactions } from "@/app/actions/transactions"
import { getCategories } from "@/app/actions/categories"
import { getAllLofts } from "@/app/actions/auth"
import { getCurrencies } from "@/app/actions/currencies"
import { getPaymentMethods } from "@/app/actions/payment-methods"
import { TransactionsList } from "@/components/transactions/transactions-list"
import { TransactionsPageClient } from "./transactions-page-client"

export default async function TransactionsPage() {
  const session = await requireRole(["admin", "manager"])
  const transactions = await getTransactions()
  const categories = await getCategories()
  const lofts = await getAllLofts()
  const currencies = await getCurrencies()
  const paymentMethods = await getPaymentMethods()

  return (
    <TransactionsPageClient
      session={session}
      transactions={transactions}
      categories={categories}
      lofts={lofts || []}
      currencies={currencies}
      paymentMethods={paymentMethods}
    />
  )
}
