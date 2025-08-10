import { getOwners } from "@/app/actions/owners"
import { getZoneAreas } from "@/app/actions/zone-areas"
import { getInternetConnectionTypes } from "@/app/actions/internet-connections"
import { NewLoftFormWrapper } from "./new-loft-form"
import { getTranslations } from "@/lib/i18n/server"

export default async function NewLoftPage() {
  const owners = await getOwners()
  const zoneAreas = await getZoneAreas()
  const t = await getTranslations()

  let internetConnectionTypes: any[] = []
  try {
    const { data: internetData, error } = await getInternetConnectionTypes()
    if (!error && internetData) {
      internetConnectionTypes = internetData
    }
  } catch (error) {
    console.error('Failed to load internet connection types:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          {t('lofts.createNewLoft')}
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {t('lofts.addNewPropertyListing')}
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <NewLoftFormWrapper
          owners={owners}
          zoneAreas={zoneAreas}
          internetConnectionTypes={internetConnectionTypes}
          translations={{
            loftCreatedSuccess: t('lofts.loftCreatedSuccess'),
            loftCreatedSuccessDescription: t('lofts.loftCreatedSuccessDescription'),
            errorCreatingLoft: t('lofts.errorCreatingLoft'),
            errorCreatingLoftDescription: t('lofts.errorCreatingLoftDescription'),
            systemError: t('lofts.systemError'),
            systemErrorDescription: t('lofts.systemErrorDescription'),
          }}
        />
      </div>
    </div>
  )
}
