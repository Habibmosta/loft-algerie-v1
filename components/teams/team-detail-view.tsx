"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/context"
import Link from "next/link"
import { format } from "date-fns"

interface Team {
  id: string
  name: string
  description?: string
  created_at: string
}

interface TeamDetailViewProps {
  team: Team | null
  teamId: string
}

export function TeamDetailView({ team, teamId }: TeamDetailViewProps) {
  const { t } = useTranslation(["common", "teams"])

  if (!team) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('teams.teamNotFound')}</h1>
          <p className="text-muted-foreground">{t('teams.couldNotFindTeam')} {teamId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground">{t('teams.teamId')}: {team.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/teams/${team.id}/edit`}>
              {t('common.edit')}
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('teams.team_details')}</CardTitle>
          <CardDescription>{t('teams.basicInformation')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {team.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('teams.description')}</h3>
                <p className="whitespace-pre-wrap">{team.description}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('teams.createdAt')}</h3>
              <p>{format(new Date(team.created_at), "PPP")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}