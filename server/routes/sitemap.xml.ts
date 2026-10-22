import { getPublishedRoutes } from '#shared/tools'
import { absoluteUrl } from '#shared/site'

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]!)
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const urls = getPublishedRoutes()
    .map(path => `  <url><loc>${escapeXml(absoluteUrl(config.public.siteUrl, path))}</loc></url>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
