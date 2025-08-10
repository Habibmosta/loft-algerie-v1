import { getZoneAreas, ZoneArea } from "@/app/actions/zone-areas";
import ZoneAreasClientWrapper from "./zone-areas-client-wrapper";
import { getTranslations } from "@/lib/i18n/server";

export default async function ZoneAreasPage() {
  const initialZoneAreas = await getZoneAreas();
  const t = await getTranslations();

  const translations = {
    pageTitle: t('nav.zoneAreas'),
    subtitle: t('zoneAreas.subtitle'),
    addNew: t('settings.zoneAreas.addNew'),
    updateZoneArea: t('zoneAreas.updateZoneArea'),
    createZoneArea: t('zoneAreas.createZoneArea'),
    updateZoneAreaInfo: t('settings.zoneAreas.updateZoneAreaInfo'),
    createNewZoneArea: t('settings.zoneAreas.createNewZoneArea'),
    existingZoneAreas: t('settings.zoneAreas.existingZoneAreas'),
    totalZoneAreas: t('settings.zoneAreas.totalZoneAreas'),
    noZoneAreasFound: t('settings.zoneAreas.noZoneAreasFound'),
    addFirstZoneArea: t('settings.zoneAreas.addFirstZoneArea'),
    success: t('common.success'),
    error: t('common.error'),
    updateSuccess: t('zoneAreas.updateSuccess'),
    createSuccess: t('zoneAreas.createSuccess'),
    refreshError: t('settings.zoneAreas.refreshError'),
  };

  return (
    <ZoneAreasClientWrapper
      initialZoneAreas={initialZoneAreas}
      translations={translations}
    />
  );
}
