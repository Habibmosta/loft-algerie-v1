import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { format } from "date-fns"
import { DeleteOwnerButton } from "./delete-button"
import { useTranslation } from "react-i18next"

export default async function OwnerViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const { t } = useTranslation();
  const { data: owner, error } = await supabase
    .from("loft_owners")
    .select("*")
    .eq("id", id)
    .single()

  if (!owner) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('owners.notFoundTitle')}</h1>
          <p className="text-muted-foreground">{t('owners.notFoundDescription', { id })}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{owner.name}</h1>
          <p className="text-muted-foreground">{t('owners.ownerDetails')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('owners.ownerInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{t('owners.ownershipType')}</h3>
            <p>{owner.ownership_type === "company" ? t('owners.companyOwned') : t('owners.thirdParty')}</p>
          </div>
          
          {owner.email && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('auth.email')}</h3>
              <p>{owner.email}</p>
            </div>
          )}

          {owner.phone && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('lofts.phoneNumber')}</h3>
              <p>{owner.phone}</p>
            </div>
          )}

          {owner.address && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('lofts.loftAddress')}</h3>
              <p>{owner.address}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <DeleteOwnerButton id={owner.id} />
            <Button variant="outline" asChild>
              <Link href={`/owners/${owner.id}/edit`}>{t('common.edit')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
