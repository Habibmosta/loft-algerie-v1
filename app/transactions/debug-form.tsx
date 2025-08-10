"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function DebugForm() {
  const { t } = useTranslation();
  const [type, setType] = useState('income')
  const [status, setStatus] = useState('completed')

  const handleSubmit = async () => {
    console.log('Submitting:', { type, status })
    const res = await fetch('/api/debug-transaction', {
      method: 'POST',
      body: JSON.stringify({ type, status }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await res.json()
    console.log('Server response:', result)
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <label>{t('transactions.type')}:</label>
        <select
          value={type}
          onChange={(e) => {
            console.log('Type changed to:', e.target.value)
            setType(e.target.value)
          }}
          className="border p-2 ml-2"
        >
          <option value="income">{t('transactions.income')}</option>
          <option value="expense">{t('transactions.expense')}</option>
        </select>
      </div>

      <div>
        <label>{t('transactions.status')}:</label>
        <select
          value={status}
          onChange={(e) => {
            console.log('Status changed to:', e.target.value)
            setStatus(e.target.value)
          }}
          className="border p-2 ml-2"
        >
          <option value="pending">{t('transactions.pending')}</option>
          <option value="completed">{t('transactions.completed')}</option>
        </select>
      </div>

      <Button onClick={handleSubmit}>{t('common.submit')}</Button>
    </div>
  )
}
