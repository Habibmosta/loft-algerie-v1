"use client"

import { useTranslation } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { OwnersList } from "@/app/owners/owners-list"
import type { LoftOwner } from "@/lib/types"

interface OwnersWrapperProps {
  owners: (LoftOwner & { loft_count: string; total_monthly_value: string })[]
}

export function OwnersWrapper({ owners }: OwnersWrapperProps) {
  const { t } = useTranslation(["common", "owners"]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('owners.title')}</h1>
          <p className="text-muted-foreground">{t('owners.subtitle')}</p>
        </div>
        <Button asChild>
          <Link href="/owners/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('owners.addOwner')}
          </Link>
        </Button>
      </div>

      <OwnersList owners={owners} />
    </div>
  )
}