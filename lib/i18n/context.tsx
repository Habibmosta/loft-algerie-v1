"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { I18nextProvider } from "react-i18next"
import i18next from "i18next"
import { initializeI18n } from "./index"

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
  lang?: string;
}

export function I18nProvider({ children, lang }: I18nProviderProps) {
  const [ready, setReady] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('fr')
  const router = useRouter(); // Moved useRouter to the top level of the component

  useEffect(() => {
    const initializeI18nContext = async () => {
      try {
        // Initialize i18n with the provided language or default
        const initialLang = lang || 'fr';
        await initializeI18n({ 
          lng: initialLang
        });
        
        await i18next.changeLanguage(initialLang);
        
        setCurrentLanguage(i18next.language)
        
        i18next.on('languageChanged', (lng: string) => {
          setCurrentLanguage(lng)
          if (typeof window !== 'undefined') {
            document.cookie = `language=${lng}; path=/; max-age=31536000; SameSite=Lax`;
          }
        })
        
        setReady(true)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        setReady(true)
      }
    }

    initializeI18nContext()
    
    // Clean up listener on unmount
    return () => {
      if (i18next) {
        i18next.off('languageChanged')
      }
    }
  }, [lang])

  const contextValue: I18nContextType = {
    t: i18next.t.bind(i18next),
    i18n: i18next,
    ready,
    language: currentLanguage,
    changeLanguage: async (lng: string) => {
      try {
        await i18next.changeLanguage(lng);
        setCurrentLanguage(lng);
        router.refresh(); // Trigger a soft navigation to re-render server components
        const currentPathname = window.location.pathname; // Get the current pathname
        // Construct the new path with the selected language
        // Assuming the current path is /lang/rest-of-path, we replace the /lang part
        const pathSegments = currentPathname.split('/');
        pathSegments[1] = lng; // Replace the language segment
        const newPath = pathSegments.join('/');
        router.push(newPath); // Navigate to the new path
      } catch (error) {
        console.error('Failed to change language:', error)
      }
    },
  }

  if (!ready) {
    return <div>Loading translations...</div>;
  }

  return (
    <I18nextProvider i18n={i18next}>
      <I18nContext.Provider value={contextValue}>
        {children}
      </I18nContext.Provider>
    </I18nextProvider>
  )
}

export function useTranslation(namespaces?: string | string[]) {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  
  // If specific namespaces are requested, ensure they are loaded
  if (namespaces && context.i18n) {
    const nsArray = Array.isArray(namespaces) ? namespaces : [namespaces]
    nsArray.forEach(ns => {
      // Check if the namespace is already loaded
      if (!context.i18n.hasResourceBundle(context.i18n.language, ns)) {
        // Try to load the namespace
        context.i18n.loadNamespaces(ns).catch(err => {
          console.error('Failed to load namespace:', ns, err)
        })
      }
    })
  }
  
  return context
}