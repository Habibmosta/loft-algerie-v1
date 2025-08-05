"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormWrapper, FormSection } from "@/components/ui/form-wrapper"
import Link from "next/link"
import { requestPasswordReset } from "@/lib/auth"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await requestPasswordReset(data.email)
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Failed to send reset email")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <FormWrapper 
        maxWidth="md"
        title="Vérifiez votre email"
        description="Nous avons envoyé un lien de réinitialisation à votre adresse email."
        icon="📧"
      >
        <FormSection colorScheme="green">
          <div className="text-center">
            <p className="text-green-700 mb-4">
              Un email de réinitialisation a été envoyé avec succès !
            </p>
            <Link href="/login" className="text-green-800 hover:underline font-medium">
              Retour à la connexion
            </Link>
          </div>
        </FormSection>
      </FormWrapper>
    )
  }

  return (
    <FormWrapper 
      maxWidth="md"
      title="Mot de passe oublié ?"
      description="Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe."
      icon="🔑"
    >
      <FormSection>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Entrez votre email" 
              {...register("email")} 
              disabled={isLoading} 
              className="bg-white" 
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </Button>
        </form>
      </FormSection>

      <FormSection colorScheme="blue">
        <div className="text-center">
          <Link href="/login" className="text-blue-800 hover:underline font-medium">
            Retour à la connexion
          </Link>
        </div>
      </FormSection>
    </FormWrapper>
  )
}
