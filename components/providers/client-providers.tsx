"use client"

import React from "react"
import { I18nProvider } from "@/lib/i18n/context"
import SupabaseProvider from "@/components/providers/supabase-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from '@/components/providers/toast-provider'
import { EnhancedRealtimeProvider } from '@/components/providers/enhanced-realtime-provider'
import { NotificationProvider } from '@/components/providers/notification-context'
import { CriticalAlertsNotification } from '@/components/executive/critical-alerts-notification'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import { getSession } from "@/lib/auth"
import { getUnreadNotificationsCount } from "@/app/actions/notifications"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface ClientProvidersProps {
  children: React.ReactNode;
  session: any; // Type this more specifically if possible
  unreadCount: number | null;
}

export default function ClientProviders({ children, session, unreadCount }: ClientProvidersProps) {
  return (
    <I18nProvider>
      <SupabaseProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <ToastProvider />
        {session ? ( // Render full layout with sidebar/header if session exists
          <EnhancedRealtimeProvider userId={session.user.id}>
            <NotificationProvider userId={session.user.id}>
              <div className="flex h-screen bg-background md:gap-x-4">
                <div className="hidden md:flex">
                  <Sidebar user={session.user} unreadCount={unreadCount} />
                </div>
                <div className="flex flex-1 flex-col">
                  <Header user={session.user} />
                  <main className="flex-1 overflow-y-auto">
                    {children}
                  </main>
                </div>
                {/* Notifications d'alertes critiques pour les executives */}
                <CriticalAlertsNotification
                  userId={session.user.id}
                  userRole={session.user.role}
                />
                {/* Prompt d'installation PWA */}
                <InstallPrompt />
              </div>
            </NotificationProvider>
          </EnhancedRealtimeProvider>
        ) : ( // Render children directly (e.g., login page) if no session
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        )}
        </ThemeProvider>
      </SupabaseProvider>
    </I18nProvider>
  );
}