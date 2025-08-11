import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoftBillManagement } from "@/components/loft/bill-management"
import Link from "next/link"
import { getTranslations } from "@/lib/i18n/server"
import type { LoftStatus } from "@/lib/types"

export default async function LoftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const session = await requireRole(["admin", "manager"])
  const supabase = await createClient()
  const i18n = await getTranslations(['lofts', 'common'])
  const t = i18n.t.bind(i18n)

  const { data: loft, error } = await supabase
    .from("lofts")
    .select(
      `
      *,
      loft_owners (name, ownership_type)
    `
    )
    .eq("id", awaitedParams.id)
    .single()

  if (!loft) {
    return notFound()
  }

  const statusTranslationKeys = {
    available: "lofts.status.available",
    occupied: "lofts.status.occupied",
    maintenance: "lofts.status.maintenance",
  } as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{loft.name}</h1>
        <p className="text-muted-foreground">{loft.address}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('lofts.loftInfoTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('common.status')}</p>
              <p className="font-medium">{t(statusTranslationKeys[loft.status as LoftStatus])}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('lofts.dailyRent')}</p>
              <p className="font-medium">{loft.price_per_month} {t('common.currencies.da')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('lofts.owner')}</p>
              <p className="font-medium">{loft.loft_owners?.name || t('lofts.unknown')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('common.owners.ownershipType')}</p>
              <p className="font-medium">{loft.loft_owners?.ownership_type?.replace('_', ' ')}</p>
            </div>
          </div>
          {loft.description && (
            <div>
              <p className="text-sm text-muted-foreground">{t('lofts.loftDescription')}</p>
              <p className="font-medium">{loft.description}</p>
            </div>
          )}
          <div className="mt-6 flex gap-4">
            <Button asChild>
              <Link href={`/lofts/${awaitedParams.id}/edit`}>{t('lofts.updateLoft')}</Link>
            </Button>
            <Button asChild>
              <Link href={`/lofts/${awaitedParams.id}/link-airbnb`}>{t('common.lofts.linkToAirbnb')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <LoftBillManagement loftId={awaitedParams.id} loftData={loft} />
    </div>
  )
}
