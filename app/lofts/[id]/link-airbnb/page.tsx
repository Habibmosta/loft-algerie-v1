import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { linkLoftToAirbnb } from "@/app/actions/lofts"
import { useTranslation } from "react-i18next"

export default async function LinkAirbnbPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireRole(["admin"])
  const supabase = await createClient()
  const { t } = useTranslation();

  const { data: loft, error } = await supabase
    .from("lofts")
    .select("id, name, airbnb_listing_id")
    .eq("id", id)
    .single()

  if (error || !loft) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('lofts.linkToAirbnbTitle', { name: loft.name })}</h1>
        <p className="text-muted-foreground">
          {t('lofts.linkToAirbnbDescription')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('lofts.linkToAirbnb')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={linkLoftToAirbnb.bind(null, loft.id)}>
            <div className="space-y-2">
              <Label htmlFor="airbnb_listing_id">{t('lofts.airbnbListingId')}</Label>
              <Input
                id="airbnb_listing_id"
                name="airbnb_listing_id"
                defaultValue={loft.airbnb_listing_id || ""}
              />
            </div>
            <div className="mt-4">
              <Button type="submit">{t('lofts.link')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
