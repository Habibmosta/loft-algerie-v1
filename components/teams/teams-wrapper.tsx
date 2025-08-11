"use client"

import { useTranslation } from "@/lib/i18n/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import Link from "next/link"

interface Team {
  id: string
  name: string
  description?: string
  created_by_name: string
  member_count: string
  active_tasks: string
}

interface TeamsWrapperProps {
  teams: Team[]
  userRole: string
}

export function TeamsWrapper({ teams, userRole }: TeamsWrapperProps) {
  const { t } = useTranslation(["common", "teams"]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('teams.title')}</h1>
          <p className="text-muted-foreground">{t('teams.subtitle')}</p>
        </div>
        {userRole === "admin" && (
          <Button asChild>
            <Link href="/teams/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('teams.addTeam')}
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <CardDescription>{t('teams.createdBy')} {team.created_by_name}</CardDescription>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{Number.parseInt(team.member_count)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.description && <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('teams.activeTasks')}:</span>
                  <Badge variant="secondary">{Number.parseInt(team.active_tasks)}</Badge>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/teams/${team.id}`}>{t('common.view')}</Link>
                </Button>
                {userRole === "admin" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/teams/${team.id}/edit`}>{t('common.edit')}</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}