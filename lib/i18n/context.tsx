'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { translations, Language } from './translations'

interface I18nContextType {
  t: (key: string, params?: Record<string, string | number>) => string
  language: Language
  setLanguage: (lang: Language) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  initialLanguage?: Language
}

export function I18nProvider({ children, initialLanguage = 'fr' }: I18nProviderProps) {
  // Always start with French to avoid language mixing issues
  const [language, setLanguageState] = React.useState<Language>('fr')
  const [isHydrated, setIsHydrated] = React.useState(false)

  // Hydrate with cookie value after initial render
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = document.cookie
        .split('; ')
        .find(row => row.startsWith('language='))
        ?.split('=')[1] as Language
      
      // Only use saved language if it's valid and has complete translations
      if (savedLanguage && translations[savedLanguage] && savedLanguage !== language) {
        // Verify that the saved language has the required translations
        if (translations[savedLanguage].settings && translations[savedLanguage].zoneAreas) {
          setLanguageState(savedLanguage)
        } else {
          // If translations are incomplete, force French and clear the cookie
          console.warn(`Incomplete translations for ${savedLanguage}, forcing French`)
          document.cookie = 'language=fr; path=/; max-age=' + (60 * 60 * 24 * 365)
          setLanguageState('fr')
        }
      }
      setIsHydrated(true)
    }
  }, [])

  // Save initial language to cookie if not already set
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('language='))
      
      if (!currentCookie) {
        document.cookie = `language=${language}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
      }
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Save to cookie immediately
    if (typeof window !== 'undefined') {
      document.cookie = `language=${lang}; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
      // Force page reload to update server-side translations
      window.location.reload()
    }
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let result: any = translations[language]
    
    // Ensure we have a valid language and translations
    if (!translations[language]) {
      console.warn(`Language '${language}' not found, falling back to French`)
      result = translations.fr
    }
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      } else {
        // Fallback hierarchy: current language -> French -> English -> key
        let fallbackResult: any = null
        
        // Try French first
        if (language !== 'fr' && translations.fr) {
          fallbackResult = translations.fr
          for (const fallbackKey of keys) {
            if (fallbackResult && typeof fallbackResult === 'object' && fallbackKey in fallbackResult) {
              fallbackResult = fallbackResult[fallbackKey]
            } else {
              fallbackResult = null
              break
            }
          }
        }
        
        // If French failed, try English
        if (!fallbackResult && language !== 'en' && translations.en) {
          fallbackResult = translations.en
          for (const fallbackKey of keys) {
            if (fallbackResult && typeof fallbackResult === 'object' && fallbackKey in fallbackResult) {
              fallbackResult = fallbackResult[fallbackKey]
            } else {
              fallbackResult = null
              break
            }
          }
        }
        
        result = fallbackResult || key
        break
      }
    }
    
    let translatedString = result || key

    // Ensure we return a string
    if (typeof translatedString !== 'string') {
      console.warn(`Translation for '${key}' is not a string:`, translatedString)
      return key
    }

    // Replace placeholders if params are provided
    if (params) {
      for (const paramKey in params) {
        translatedString = translatedString.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(params[paramKey]))
      }
    }
    
    return translatedString
  }

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}
