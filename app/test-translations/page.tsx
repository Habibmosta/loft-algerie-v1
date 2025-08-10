"use client"

import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestTranslationsPage() {
  const { t, i18n } = useTranslation()
  const { language, changeLanguage } = i18n

  const testKeys = [
    'zoneAreas.name',
    'zoneAreas.actions',
    'zoneAreas.existingZoneAreas',
    'settings.categories.subtitle',
    'settings.currencies.subtitle',
    'settings.paymentMethods.subtitle'
  ]

  console.log('i18n object:', i18n);
  testKeys.forEach(key => {
    console.log(`Key: ${key}, Value: ${t(key)}`);
  });

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('testTranslations.title')}</CardTitle>
          <p>{t('testTranslations.currentLanguage')}: <strong>{language}</strong></p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => changeLanguage('fr')}
              variant={language === 'fr' ? 'default' : 'outline'}
            >
              {t('testTranslations.french')}
            </Button>
            <Button
              onClick={() => changeLanguage('en')}
              variant={language === 'en' ? 'default' : 'outline'}
            >
              {t('testTranslations.english')}
            </Button>
            <Button
              onClick={() => changeLanguage('ar')}
              variant={language === 'ar' ? 'default' : 'outline'}
            >
              {t('testTranslations.arabic')}
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">{t('testTranslations.testedTranslations')}:</h3>
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