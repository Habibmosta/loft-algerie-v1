"use client"

import { useTranslation } from "@/lib/i18n/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users, Calendar, Settings } from "lucide-react"
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
  const { t, ready } = useTranslation(["common", "teams"])



  // Attendre que les traductions soient prêtes
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des traductions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            {t('title', { ns: 'teams' })}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {t('subtitle', { ns: 'teams' })}
          </p>
        </div>
        
        {userRole === "admin" && (
          <Button 
            asChild 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link href="/teams/new" className="flex items-center gap-2 px-6 py-3">
              <Plus className="h-5 w-5" />
              <span className="font-medium">{t('addTeam', { ns: 'teams' })}</span>
            </Link>
          </Button>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('totalTeams', { ns: 'teams' })}</p>
                <p className="text-3xl font-bold text-gray-900">{teams.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('activeMembers', { ns: 'teams' })}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teams.reduce((total, team) => total + parseInt(team.member_count), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('tasksInProgress', { ns: 'teams' })}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {teams.reduce((total, team) => total + parseInt(team.active_tasks), 0)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des équipes */}
      {teams.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune équipe trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer votre première équipe pour organiser votre travail.
            </p>
            {userRole === "admin" && (
              <Button asChild>
                <Link href="/teams/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une équipe
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {team.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      <span className="font-medium">{t('createdBy', { ns: 'teams' })}</span> {team.created_by_name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {parseInt(team.member_count)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Description de l'équipe */}
                {team.description && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {team.description}
                    </p>
                  </div>
                )}

                {/* Statistiques de l'équipe */}
                <div className="flex justify-between items-center py-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-600">
                    {t('activeTasks', { ns: 'teams' })}
                  </span>
                  <Badge 
                    variant={parseInt(team.active_tasks) > 0 ? "default" : "secondary"}
                    className="font-medium"
                  >
                    {parseInt(team.active_tasks)} tâche{parseInt(team.active_tasks) !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild 
                    className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Link href={`/teams/${team.id}`} className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{t('common.view')}</span>
                    </Link>
                  </Button>
                  
                  {userRole === "admin" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="flex-1 hover:bg-gray-50 hover:border-gray-300"
                    >
                      <Link href={`/teams/${team.id}/edit`} className="flex items-center justify-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>{t('common.edit')}</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}