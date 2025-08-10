"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign } from "lucide-react"
import Link from "next/link"
import { TransactionsList } from "@/components/transactions/transactions-list"
import { useTranslation } from "react-i18next"
import { CreateForm } from "@/components/transactions/CreateForm"
import { createTransaction } from "@/app/actions/transactions"

interface TransactionsPageClientProps {
  session: any
  transactions: any[]
  categories: any[]
  lofts: any[]
  currencies: any[]
  paymentMethods: any[]
}

export function TransactionsPageClient({
  session,
  transactions: initialTransactions,
  categories,
  lofts,
  currencies,
  paymentMethods
}: TransactionsPageClientProps) {
  const { t } = useTranslation('transactions')
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    setTransactions(initialTransactions)
  }, [initialTransactions])

  const handleCreateTransaction = async (data: any) => {
    try {
      const newTransaction = await createTransaction(data)
      setTransactions(prev => [newTransaction, ...prev])
    } catch (error) {
      console.error("Failed to create transaction:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('transactions.title')}</h1>
          <p className="text-muted-foreground">{t('transactions.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          {(session.user.role === "admin" || session.user.role === "manager") && (
            <Button asChild variant="outline">
              <Link href="/transactions/reference-amounts">
                <DollarSign className="mr-2 h-4 w-4" />
                {t('transactions.referenceAmounts')}
              </Link>
            </Button>
          )}
          {session.user.role === "admin" && (
            <Button asChild>
              <Link href="/transactions/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('transactions.addNewTransaction')}
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {session.user.role === "admin" && (
        <CreateForm
          onSubmit={handleCreateTransaction}
          categories={categories}
          lofts={lofts}
          currencies={currencies}
          paymentMethods={paymentMethods}
        />
      )}

      <TransactionsList
        transactions={transactions}
        categories={categories}
        lofts={lofts}
        currencies={currencies}
        paymentMethods={paymentMethods}
        isAdmin={session.user.role === "admin"}
      />
    </div>
  )
}

