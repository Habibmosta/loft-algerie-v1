"use client"

import { requireRole } from "@/lib/auth"
import { getPaymentMethods } from "@/app/actions/payment-methods"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Banknote, Smartphone, Building2, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/context"
import { useEffect, useState } from "react"
import type { PaymentMethod } from "@/lib/types"

const getPaymentMethodIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'card':
    case 'credit_card':
    case 'debit_card':
      return <CreditCard className="h-5 w-5" />
    case 'cash':
    case 'especes':
      return <Banknote className="h-5 w-5" />
    case 'mobile':
    case 'mobile_payment':
      return <Smartphone className="h-5 w-5" />
    case 'bank':
    case 'bank_transfer':
      return <Building2 className="h-5 w-5" />
    default:
      return <CreditCard className="h-5 w-5" />
  }
}

const getPaymentMethodColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'card':
    case 'credit_card':
    case 'debit_card':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'cash':
    case 'especes':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'mobile':
    case 'mobile_payment':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'bank':
    case 'bank_transfer':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export default function PaymentMethodsPage() {
  const { t } = useTranslation()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        await requireRole(["admin"])
        const data = await getPaymentMethods()
        setPaymentMethods(data)
      } catch (error) {
        console.error('Failed to load payment methods:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPaymentMethods()
  }, [])

  if (loading) {
    return <div className="p-8">{t('common.loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-primary" />
            {t('nav.paymentMethods')}
          </h1>
          <p className="text-muted-foreground">{t('settings.paymentMethods.subtitle')}</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/settings/payment-methods/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('settings.paymentMethods.addPaymentMethod')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('settings.paymentMethods.existingMethods')}
            </CardTitle>
            <CardDescription>
              {t('settings.paymentMethods.totalMethods', { count: paymentMethods.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  {t('settings.paymentMethods.noMethodsFound')}
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('settings.paymentMethods.addFirstMethod')}
                </p>
                <Button asChild>
                  <Link href="/settings/payment-methods/new">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('settings.paymentMethods.addPaymentMethod')}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paymentMethods.map((method, index) => (
                  <Card 
                    key={method.id} 
                    className="relative group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:scale-110 transition-transform duration-300">
                            {getPaymentMethodIcon(method.type || '')}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{method.name}</h3>
                            {method.type && (
                              <Badge 
                                variant="secondary" 
                                className={`text-xs mt-1 ${getPaymentMethodColor(method.type)} border-0`}
                              >
                                {method.type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
                            <Link href={`/settings/payment-methods/edit/${method.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {method.details && (
                        <div className="text-sm text-muted-foreground mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <p className="truncate">{t('settings.paymentMethods.additionalDetails')}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          {t('settings.paymentMethods.createdOn')}
                        </span>
                        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-white transition-colors">
                          <Link href={`/settings/payment-methods/edit/${method.id}`}>
                            <Edit className="h-3 w-3 mr-1" />
                            {t('common.edit')}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}