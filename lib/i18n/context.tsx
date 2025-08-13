"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18next from "i18next"

interface I18nContextType {
  t: typeof i18next.t;
  i18n: typeof i18next;
  ready: boolean;
  language: string;
  changeLanguage: (lng: string) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [ready, setReady] = useState(false)
  const [i18nInstance, setI18nInstance] = useState<typeof i18next | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        // Import and initialize the i18n configuration
        const { default: i18nInstance } = await import("./index")
        if (!i18nInstance.isInitialized) {
          await i18nInstance.init()
        }
        
        // Vérifier la langue sauvegardée dans localStorage
        const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null
        if (savedLanguage && ['en', 'fr', 'ar'].includes(savedLanguage)) {
          await i18nInstance.changeLanguage(savedLanguage)
        }
        
        setI18nInstance(i18nInstance)
        setCurrentLanguage(i18nInstance.language || 'fr')
        
        // Listen for language changes
        i18nInstance.on('languageChanged', (lng: string) => {
          setCurrentLanguage(lng)
        })
        
        setReady(true)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        setReady(true) // Set ready even on error to prevent infinite loading
      }
    }

    initializeI18n()
  }, [])

  const contextValue: I18nContextType = {
    t: i18nInstance?.t.bind(i18nInstance) || (() => ''),
    i18n: i18nInstance || i18next,
    ready: ready && !!i18nInstance,
    language: currentLanguage,
    changeLanguage: async (lng: string) => {
      try {
        if (i18nInstance) {
          await i18nInstance.changeLanguage(lng);
          setCurrentLanguage(lng);
          // Force reload of resources for the new language
          await i18nInstance.reloadResources(lng, ['reservations', 'common', 'teams', 'bills', 'lofts', 'owners', 'transactions']);
          // Force clear cache and reload transactions specifically
          i18nInstance.removeResourceBundle(lng, 'transactions');
          await i18nInstance.loadNamespaces(['transactions']);
        }
      } catch (error) {
        console.error('Failed to change language:', error)
      }
    },
  }

  return (
    <I18nextProvider i18n={i18nInstance || i18next}>
      <I18nContext.Provider value={contextValue}>
        {ready && i18nInstance ? children : <div>Loading translations...</div>}
      </I18nContext.Provider>
    </I18nextProvider>
  )
}

export function useTranslation(namespaces?: string | string[]) {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  
  // If namespaces are specified, load them
  if (namespaces && context.i18n) {
    const nsArray = Array.isArray(namespaces) ? namespaces : [namespaces]
    nsArray.forEach(ns => {
      if (!context.i18n.hasResourceBundle(context.i18n.language, ns)) {
        context.i18n.loadNamespaces(ns)
      }
    })
  }
  
  return context
}