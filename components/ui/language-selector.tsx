"use client"

import { useTranslation } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { FlagIcon } from "@/components/ui/flag-icon"
import { useState } from "react"

const languages = [
  { code: 'fr', name: 'Français', flagCode: 'FR' as const },
  { code: 'en', name: 'English', flagCode: 'GB' as const },
  { code: 'ar', name: 'العربية', flagCode: 'DZ' as const }
]

interface LanguageSelectorProps {
  showText?: boolean
}

export function LanguageSelector({ showText = false }: LanguageSelectorProps) {
  const { language, changeLanguage } = useTranslation()
  const [isChanging, setIsChanging] = useState(false)

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === language) return
    
    setIsChanging(true)
    try {
      await changeLanguage(langCode)
      // Sauvegarder dans localStorage
      localStorage.setItem('language', langCode)
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error)
    } finally {
      setIsChanging(false)
    }
  }

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-2 ${showText ? 'h-8 px-3' : 'h-8 w-8 p-0'} text-white hover:text-white hover:bg-gray-600`}
          disabled={isChanging}
        >
          {isChanging ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
          ) : (
            <>
              <FlagIcon country={currentLanguage.flagCode} className="w-5 h-4" />
              {showText && <span className="text-sm font-medium">{currentLanguage.name}</span>}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FlagIcon country={lang.flagCode} className="w-5 h-4" />
              <span>{lang.name}</span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}