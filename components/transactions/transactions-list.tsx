"use client"

import { useTranslation } from 'react-i18next'
import { 
  translateTransactionDescription, 
  translateTransactionStatus, 
  translateTransactionType,
  translatePaymentMethod,
  translateCurrency
} from '@/lib/utils/transaction-translator'

interface TransactionsListProps {
  transactions: {
    id: string
    description: string
    status: string
    type: string
    amount: number
    currency: string
    payment_method?: string
    date: string
    equivalent?: number
    ratio?: number
  }[]
  categories: any[]
  lofts: any[]
  currencies: any[]
  paymentMethods: any[]
  isAdmin: boolean
  children?: React.ReactNode
}

export function TransactionsList({ transactions, categories, lofts, currencies, paymentMethods, isAdmin, children }: TransactionsListProps) {
  const { i18n } = useTranslation()
  const language = i18n.language

  return (
    <div>
      {transactions.map((transaction) => {
        const translatedDescription = translateTransactionDescription(transaction.description, language)
        const translatedStatus = translateTransactionStatus(transaction.status, language)
        const translatedType = translateTransactionType(transaction.type, language)
        const translatedPaymentMethod = transaction.payment_method
          ? translatePaymentMethod(transaction.payment_method, language)
          : ''
        const translatedCurrency = translateCurrency(transaction.currency, language)

        return (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-description">
              {translatedDescription}
            </div>
            <div className="transaction-date">
              {new Date(transaction.date).toLocaleDateString(
                language === 'ar' ? 'ar-DZ' :
                language === 'fr' ? 'fr-FR' : 'en-US'
              )}
            </div>
            <div className="transaction-status">
              {translatedStatus}
            </div>
            <div className="transaction-amount">
              {transaction.type === 'expense' ? '-' : '+'}
              {translatedCurrency} {transaction.amount.toLocaleString(
                language === 'ar' ? 'ar-DZ' :
                language === 'fr' ? 'fr-FR' : 'en-US'
              )}
            </div>
            {transaction.equivalent && (
              <div className="transaction-equivalent">
                المعادل: DA {transaction.equivalent.toLocaleString('ar-DZ')}
                (النسبة: {transaction.ratio})
              </div>
            )}
            {translatedPaymentMethod && (
              <div className="transaction-payment-method">
                طريقة الدفع: {translatedPaymentMethod}
              </div>
            )}
          </div>
        )
      })}
      {children}
    </div>
  )
}