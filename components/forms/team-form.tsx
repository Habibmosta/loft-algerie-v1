"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormWrapper, FormSection } from "@/components/ui/form-wrapper"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/i18n/context"
import type { Team } from "@/lib/types"

interface TeamFormProps {
  team?: Team
  action: (formData: FormData) => Promise<{ error?: string; team?: Team }>
}

export function TeamForm({ team, action }: TeamFormProps) {
  const { t } = useTranslation()
  const [error, setError] = useState("")
  const router = useRouter()
  const { pending } = useFormStatus()

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
        toast({
          title: "❌ Error",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        })
      } else if (result?.team) {
        toast({
          title: "✅ Success",
          description: `Team "${result.team.name}" ${team ? 'updated' : 'created'} successfully`,
          duration: 3000,
        })
        setTimeout(() => {
          router.push(`/teams/${result.team?.id}`)
        }, 1000)
      } else {
        const teamName = formData.get("name") as string
        toast({
          title: "✅ Success",
          description: `Team "${teamName}" ${team ? 'updated' : 'created'} successfully`,
          duration: 3000,
        })
        setTimeout(() => {
          router.push("/teams")
        }, 1000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <FormWrapper 
      maxWidth="2xl"
      title={team ? t('teams.editTeam') : t('teams.createTeam')}
      description={team ? t('teams.updateTeamInfo') : t('teams.addNewTeam')}
      icon="👥"
    >
      <FormSection 
        title={t('teams.teamDetails')}
        description={t('teams.enterTeamInfo')}
        icon="🏢"
        colorScheme="blue"
      >
        <form action={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('teams.teamName')} *</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={team?.name || ""}
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('teams.description')}</Label>
              <Textarea 
                id="description" 
                name="description"
                defaultValue={team?.description || ""}
                className="bg-white"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? t('teams.saving') : team ? t('teams.updateTeam') : t('teams.createTeam')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t('teams.cancel')}
            </Button>
          </div>
        </form>
      </FormSection>
    </FormWrapper>
  )
}
