import { createInstance } from 'i18next'
import Backend from 'i18next-fs-backend'
import { cookies } from 'next/headers'
import { getOptions } from './settings'

export async function getTranslations(ns) {
  const lng = cookies().get('language')?.value || 'ar'
  const i18n = createInstance()
  await i18n
    .use(Backend)
    .init(getOptions(lng, ns))
  return i18n
}