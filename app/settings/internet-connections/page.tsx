"use client"

import { getInternetConnectionTypes } from '@/app/actions/internet-connections';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Wifi, Signal, Globe, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import type { InternetConnectionType } from "@/lib/types";

const getConnectionIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'fiber':
    case 'fibre':
      return <Signal className="h-5 w-5" />
    case 'adsl':
    case 'dsl':
      return <Globe className="h-5 w-5" />
    case 'wifi':
    case 'wireless':
      return <Wifi className="h-5 w-5" />
    default:
      return <Wifi className="h-5 w-5" />
  }
}

const getConnectionColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'actif':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'inactive':
    case 'inactif':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export default function InternetConnectionsPage() {
  const { t } = useTranslation()
  const [internetConnectionTypes, setInternetConnectionTypes] = useState<InternetConnectionType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInternetConnections() {
      try {
        const { data, error } = await getInternetConnectionTypes()
        if (error) {
          setError(error.message)
        } else {
          setInternetConnectionTypes(data || [])
        }
      } catch (err) {
        setError('Failed to load internet connection types')
        console.error('Failed to load internet connections:', err)
      } finally {
        setLoading(false)
      }
    }
    loadInternetConnections()
  }, [])

  if (loading) {
    return <div className="p-8">{t('common.loading')}</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            {t('internetConnections.loadError')}: {error}
          </div>
          <Button onClick={() => window.location.reload()}>
            {t('common.refresh')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wifi className="h-8 w-8 text-primary" />
            {t('nav.internetConnections')}
          </h1>
          <p className="text-muted-foreground">{t('internetConnections.subtitle')}</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/settings/internet-connections/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('internetConnections.addNewConnectionType')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            {t('internetConnections.existingConnectionTypes')}
          </CardTitle>
          <CardDescription>
            {t('internetConnections.totalConnections', { count: internetConnectionTypes.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {internetConnectionTypes.length === 0 ? (
            <div className="text-center py-12">
              <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                {t('internetConnections.noConnectionTypesFound')}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {t('internetConnections.addFirstConnection')}
              </p>
              <Button asChild>
                <Link href="/settings/internet-connections/new">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('internetConnections.addNewConnectionType')}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {internetConnectionTypes.map((connection, index) => (
                <Card 
                  key={connection.id} 
                  className="relative group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                          {getConnectionIcon(connection.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{connection.type}</h3>
                          <p className="text-sm text-muted-foreground font-medium">
                            {connection.speed} • {connection.provider}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 dark:hover:bg-blue-950/20">
                          <Link href={`/settings/internet-connections/${connection.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {connection.status && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs border-0 ${getConnectionColor(connection.status)}`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-current mr-1"></div>
                          {connection.status}
                        </Badge>
                      )}
                      {connection.cost && (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('internetConnections.cost')}: <span className="text-green-600 dark:text-green-400 font-bold">{connection.cost} DA</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {t('internetConnections.provider')}: {connection.provider}
                      </span>
                      <Button variant="outline" size="sm" asChild className="hover:bg-blue-600 hover:text-white transition-colors">
                        <Link href={`/settings/internet-connections/${connection.id}`}>
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
  )
}
