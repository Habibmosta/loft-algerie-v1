"use client"

import { useTranslation } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { LoftsList } from "@/app/lofts/lofts-list"
import type { LoftWithRelations, LoftOwner, ZoneArea } from "@/lib/types"

interface LoftsWrapperProps {
  lofts: LoftWithRelations[]
  owners: LoftOwner[]
  zoneAreas: ZoneArea[]
  isAdmin: boolean
  canManage: boolean
}

export function LoftsWrapper({
  lofts,
  owners,
  zoneAreas,
  isAdmin,
  canManage
}: LoftsWrapperProps) {
  const { t } = useTranslation(["common", "lofts"]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('lofts.title')}</h1>
          <p className="text-muted-foreground">{t('lofts.subtitle')}</p>
        </div>
        {canManage && (
          <Button asChild>
            <Link href="/lofts/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('lofts.addLoft')}
            </Link>
          </Button>
        )}
      </div>
      <LoftsList
        lofts={lofts}
        owners={owners}
        zoneAreas={zoneAreas}
        isAdmin={isAdmin}
      />
    </div>
  )
}