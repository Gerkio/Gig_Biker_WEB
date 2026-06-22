'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {BarChartIcon} from '@sanity/icons'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import {bigBikerTheme} from './sanity/theme'
import {BigBikerLogo} from './sanity/logo'
import {DashboardTool} from './sanity/dashboard-tool'

// Documentos unicos: no se pueden crear, duplicar ni borrar.
const SINGLETONS = new Set(['siteSettings', 'homePage'])

// Badge de estado de stock en cada producto (estilo Shopify).
function stockBadge(props: {draft?: unknown; published?: unknown}) {
  const doc = (props.draft || props.published) as
    | {stock?: number; lowStockThreshold?: number}
    | undefined
  if (!doc) return null
  const stock = doc.stock ?? 0
  const threshold = doc.lowStockThreshold ?? 5
  if (stock === 0) return {label: 'Agotado', color: 'danger' as const}
  if (stock <= threshold)
    return {label: `Stock bajo · ${stock}`, color: 'warning' as const}
  return {label: `${stock} en stock`, color: 'success' as const}
}

// Badge de estado del pedido.
function orderBadge(props: {draft?: unknown; published?: unknown}) {
  const doc = (props.draft || props.published) as {status?: string} | undefined
  const status = doc?.status
  if (!status) return null
  const map: Record<string, {label: string; color: 'primary' | 'success' | 'warning' | 'danger'}> = {
    pendiente: {label: 'Pendiente de pago', color: 'warning'},
    pagado: {label: 'Pagado', color: 'success'},
    enviado: {label: 'Enviado', color: 'primary'},
    entregado: {label: 'Entregado', color: 'success'},
    cancelado: {label: 'Cancelado', color: 'danger'},
  }
  return map[status] ?? null
}

export default defineConfig({
  name: 'bigbiker',
  title: 'Big Biker',
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  // Identidad visual de Big Biker en el Studio
  theme: bigBikerTheme,
  studio: {
    components: {
      logo: BigBikerLogo,
    },
  },
  document: {
    // Limita las acciones disponibles en los singletons.
    actions: (input, context) =>
      SINGLETONS.has(context.schemaType)
        ? input.filter(
            ({action}) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action)
          )
        : input,
    // Evita crear nuevos singletons desde el boton global de "crear".
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((tpl) => !SINGLETONS.has(tpl.templateId))
        : prev,
    // Etiquetas de estado (stock en productos, estado en pedidos).
    badges: (prev, context) => {
      if (context.schemaType === 'product') return [...prev, stockBadge]
      if (context.schemaType === 'order') return [...prev, orderBadge]
      return prev
    },
  },
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  // Dashboard nativo (analítica/inventario) como herramienta del Studio.
  tools: (prev) => [
    {name: 'dashboard', title: 'Dashboard', icon: BarChartIcon, component: DashboardTool},
    ...prev,
  ],
})
