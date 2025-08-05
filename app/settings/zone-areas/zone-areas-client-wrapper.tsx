"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ZoneAreaList } from "@/components/zone-areas/zone-areas-list";
import { ZoneAreaForm } from "@/components/forms/zone-area-form";
import { getZoneAreas, ZoneArea } from "@/app/actions/zone-areas";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "@/lib/i18n/context";
import { MapPin, Plus, Edit } from "lucide-react";

interface ZoneAreasClientWrapperProps {
  initialZoneAreas: ZoneArea[];
}

export default function ZoneAreasClientWrapper({ initialZoneAreas }: ZoneAreasClientWrapperProps) {
  const { t } = useTranslation();
  const [editingZoneArea, setEditingZoneArea] = useState<ZoneArea | undefined>(undefined);
  const [zoneAreas, setZoneAreas] = useState<ZoneArea[]>(initialZoneAreas);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (zoneArea: ZoneArea) => {
    setEditingZoneArea(zoneArea);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setEditingZoneArea(undefined);
    setShowForm(false);
    // Re-fetch zone areas to update the list
    try {
      const updatedZoneAreas = await getZoneAreas();
      setZoneAreas(updatedZoneAreas);
      toast({
        title: "✅ " + t('common.success'),
        description: editingZoneArea 
          ? t('zoneAreas.updateSuccess') 
          : t('zoneAreas.createSuccess'),
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ " + t('common.error'),
        description: t('settings.zoneAreas.refreshError'),
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingZoneArea(undefined);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            {t('nav.zoneAreas')}
          </h1>
          <p className="text-muted-foreground text-lg">{t('zoneAreas.subtitle')}</p>
        </div>
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('settings.zoneAreas.addNew')}
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                {editingZoneArea ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              </div>
              {editingZoneArea ? t('zoneAreas.updateZoneArea') : t('zoneAreas.createZoneArea')}
            </CardTitle>
            <CardDescription className="text-base">
              {editingZoneArea 
                ? t('settings.zoneAreas.updateZoneAreaInfo') 
                : t('settings.zoneAreas.createNewZoneArea')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ZoneAreaForm 
              zoneArea={editingZoneArea} 
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('settings.zoneAreas.existingZoneAreas')}
          </CardTitle>
          <CardDescription>
            {t('settings.zoneAreas.totalZoneAreas', { count: zoneAreas.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {zoneAreas.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                {t('settings.zoneAreas.noZoneAreasFound')}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {t('settings.zoneAreas.addFirstZoneArea')}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('settings.zoneAreas.addNew')}
              </Button>
            </div>
          ) : (
            <ZoneAreaList 
              zoneAreas={zoneAreas} 
              onEdit={handleEdit} 
              onRefresh={handleFormSuccess} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
