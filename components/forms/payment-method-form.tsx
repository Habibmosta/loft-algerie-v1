"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormWrapper, FormSection } from "@/components/ui/form-wrapper"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import type { Database } from "@/lib/types"

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

const paymentMethodSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.string().optional(),
  details: z.string().optional(), // Store JSON string for details
})

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod
  action: (formData: FormData) => Promise<{ error?: string, paymentMethod?: PaymentMethod }>
}

export function PaymentMethodForm({ paymentMethod, action }: PaymentMethodFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: paymentMethod
      ? {
          name: paymentMethod.name,
          type: paymentMethod.type || "",
          details: paymentMethod.details ? JSON.stringify(paymentMethod.details, null, 2) : "",
        }
      : {
          name: "",
          type: "",
          details: "",
        },
  })

  const handleFormSubmit = async (data: PaymentMethodFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.type) formData.append("type", data.type);
      if (data.details) formData.append("details", data.details);

      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
        router.push("/settings/payment-methods")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormWrapper 
      maxWidth="2xl"
      title={paymentMethod ? t('paymentMethods.editPaymentMethod') : t('paymentMethods.addPaymentMethod')}
      description={paymentMethod ? t('paymentMethods.updatePaymentMethodInfo') : t('paymentMethods.createNewPaymentMethod')}
      icon="💳"
    >
      <FormSection 
        title={t('paymentMethods.paymentDetails')}
        description={t('paymentMethods.enterPaymentInfo')}
        icon="💰"
        colorScheme="yellow"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('paymentMethods.name')} *</Label>
              <Input id="name" {...register("name")} className="bg-white" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('paymentMethods.type')}</Label>
              <Input id="type" {...register("type")} className="bg-white" />
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">{t('paymentMethods.details')}</Label>
            <Textarea id="details" {...register("details")} rows={5} className="bg-white" />
            {errors.details && <p className="text-sm text-red-500">{errors.details.message}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? t('paymentMethods.saving') : paymentMethod ? t('paymentMethods.updatePaymentMethod') : t('paymentMethods.createPaymentMethod')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t('paymentMethods.cancel')}
            </Button>
          </div>
        </form>
      </FormSection>
    </FormWrapper>
  )
}
