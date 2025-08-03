'use client'

import { TransactionForm } from '@/components/forms/transaction-form'
import { getTransaction, updateTransaction } from '@/app/actions/transactions'
import { getCategories } from '@/app/actions/categories'
import { Transaction as TransactionFormData } from '@/lib/validations' // Corrected import
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Currency, Transaction } from '@/lib/types' // Corrected import
import { getLofts } from '@/app/actions/lofts' // Import getLofts
import { getPaymentMethods } from '@/app/actions/payment-methods'
interface Category {
  id: string;
  name: string;
  type: string;
}

interface Loft {
  id: string;
  name: string;
}

interface PaymentMethod {
  id: string;
  name: string;
}

export default function EditTransactionPage() {
  const params = useParams();

  // Initialize id here, before any conditional returns
  const id = params?.id as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lofts, setLofts] = useState<Loft[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // This return is fine as it's inside the effect
      try {
        const [transactionData, categoriesData, loftsData, currenciesData, paymentMethodsData] = await Promise.all([
          getTransaction(id),
          getCategories(),
          getLofts(),
          fetch('/api/currencies').then(res => res.json()),
          getPaymentMethods()
        ]);
        setTransaction(transactionData);
        setCategories(categoriesData);
        setLofts(loftsData);
        setCurrencies(currenciesData);
        setPaymentMethods(paymentMethodsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [id]);

  // Now, place the conditional return after all hooks are called
  if (!params || !params.id) {
    // This return handles the case where params or params.id is null/undefined
    return <div>Error: No transaction ID provided.</div>;
  }

  const handleUpdateTransaction = async (data: TransactionFormData) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      await updateTransaction(id, data)
    } catch (error) {
      console.error(error)
      // Handle error state in the form
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!transaction) return <div>Loading...</div>

  return <TransactionForm transaction={transaction} categories={categories} lofts={lofts} currencies={currencies} paymentMethods={paymentMethods} onSubmit={handleUpdateTransaction} isSubmitting={isSubmitting} />
}
