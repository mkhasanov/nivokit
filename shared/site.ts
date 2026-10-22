export function normalizeSiteUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

export function absoluteUrl(siteUrl: string, path: string): string {
  return new URL(path, `${normalizeSiteUrl(siteUrl)}/`).toString()
}
