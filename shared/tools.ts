export const supportedLocales = ['en'] as const
export const plannedLocales = ['ru', 'uz', 'es', 'de'] as const

export type SupportedLocale = (typeof supportedLocales)[number]
export type CategoryId = 'image'
export type ToolId = 'resize-image'

export interface LocalizedCategory {
  name: string
  description: string
}

export interface CategoryDefinition {
  id: CategoryId
  slug: string
  icon: 'image'
  locales: Record<SupportedLocale, LocalizedCategory>
}

export interface ToolFaq {
  question: string
  answer: string
}

export interface LocalizedTool {
  name: string
  shortDescription: string
  description: string
  seoTitle: string
  seoDescription: string
  synonyms: string[]
  steps: string[]
  faqs: ToolFaq[]
}

export interface ToolDefinition {
  id: ToolId
  category: CategoryId
  slug: string
  status: 'live'
  featured: boolean
  locales: Record<SupportedLocale, LocalizedTool>
}

export const categories: readonly CategoryDefinition[] = [
  {
    id: 'image',
    slug: 'image',
    icon: 'image',
    locales: {
      en: {
        name: 'Image tools',
        description: 'Make precise image changes locally in your browser.',
      },
    },
  },
] as const

export const tools: readonly ToolDefinition[] = [
  {
    id: 'resize-image',
    category: 'image',
    slug: 'resize-image',
    status: 'live',
    featured: true,
    locales: {
      en: {
        name: 'Resize image',
        shortDescription: 'Resize JPG, PNG, and WebP images without uploading them.',
        description: 'Set exact pixel dimensions, preserve the aspect ratio, choose a supported output format, and download the resized image. Processing stays in this browser tab.',
        seoTitle: 'Resize Image Online — Private Browser Tool | NivoKit',
        seoDescription: 'Resize JPG, PNG, and WebP images to exact dimensions in your browser. Keep the aspect ratio, choose output quality, and download without uploading files.',
        synonyms: ['image resizer', 'resize photo', 'change image size', 'scale picture', 'picture dimensions', 'photo resize'],
        steps: [
          'Choose or drop a JPG, PNG, or WebP image up to 20 MB.',
          'Enter the width and height. Keep the aspect ratio locked unless you need exact independent dimensions.',
          'Choose an output format and quality, resize the image, then download the result.',
        ],
        faqs: [
          {
            question: 'Does NivoKit upload my image?',
            answer: 'No. This tool decodes, resizes, and exports the image inside your browser. Closing the tab clears the in-memory working data.',
          },
          {
            question: 'Which image formats are supported?',
            answer: 'The tool accepts JPG, PNG, and WebP files that your browser can decode. It can export JPG, PNG, or WebP using the browser canvas encoder.',
          },
          {
            question: 'Why can the downloaded file be larger?',
            answer: 'File size depends on dimensions, format, image detail, transparency, and quality. Resizing dimensions does not guarantee a smaller file.',
          },
        ],
      },
    },
  },
] as const

export const staticPageSlugs = ['about', 'privacy', 'terms', 'contact', 'accessibility'] as const
export type StaticPageSlug = (typeof staticPageSlugs)[number]

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale)
}

export function getCategory(idOrSlug: string): CategoryDefinition | undefined {
  return categories.find(category => category.id === idOrSlug || category.slug === idOrSlug)
}

export function getCategoryTools(category: CategoryId): readonly ToolDefinition[] {
  return tools.filter(tool => tool.category === category && tool.status === 'live')
}

export function getTool(categorySlug: string, toolSlug: string): ToolDefinition | undefined {
  const category = getCategory(categorySlug)
  return category ? tools.find(tool => tool.category === category.id && tool.slug === toolSlug && tool.status === 'live') : undefined
}

export function getToolPath(tool: ToolDefinition, locale: SupportedLocale = 'en'): string {
  const category = categories.find(item => item.id === tool.category)
  if (!category) throw new Error(`Unknown category for tool: ${tool.id}`)
  return `/${locale}/${category.slug}/${tool.slug}`
}

export function getPublishedRoutes(): string[] {
  const locale: SupportedLocale = 'en'
  return [
    `/${locale}/`,
    ...categories.filter(category => getCategoryTools(category.id).length > 0).map(category => `/${locale}/${category.slug}/`),
    ...tools.map(tool => getToolPath(tool, locale)),
    ...staticPageSlugs.map(slug => `/${locale}/${slug}`),
  ]
}
