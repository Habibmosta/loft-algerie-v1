"use client"

import { useTranslation } from "@/lib/i18n/context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestTranslationsPage() {
  const { t, language, setLanguage } = useTranslation()

  const testKeys = [
    'zoneAreas.name',
    'zoneAreas.actions', 
    'zoneAreas.existingZoneAreas',
    'settings.categories.subtitle',
    'settings.currencies.subtitle',
    'settings.paymentMethods.subtitle'
  ]

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Test des Traductions</CardTitle>
          <p>Langue actuelle: <strong>{language}</strong></p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => setLanguage('fr')} 
              variant={language === 'fr' ? 'default' : 'outline'}
            >
              Français
            </Button>
            <Button 
              onClick={() => setLanguage('en')} 
              variant={language === 'en' ? 'default' : 'outline'}
            >
              English
            </Button>
            <Button 
              onClick={() => setLanguage('ar')} 
              variant={language === 'ar' ? 'default' : 'outline'}
            >
              العربية
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Traductions testées :</h3>
            {testKeys.map(key => (
              <div key={key} className="p-2 border rounded">
                <div className="text-sm text-gray-500">{key}</div>
                <div className="font-medium">{t(key)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}