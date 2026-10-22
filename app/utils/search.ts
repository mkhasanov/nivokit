import type { SupportedLocale, ToolDefinition } from '#shared/tools'

function normalize(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function isSubsequence(query: string, candidate: string): boolean {
  let queryIndex = 0
  for (const character of candidate) {
    if (character === query[queryIndex]) queryIndex += 1
    if (queryIndex === query.length) return true
  }
  return false
}

function fieldScore(query: string, value: string): number {
  const normalized = normalize(value)
  if (!normalized) return 0
  if (normalized === query) return 120
  if (normalized.startsWith(query)) return 90
  if (normalized.includes(query)) return 70

  const words = normalized.split(' ')
  if (words.some(word => word.startsWith(query))) return 55
  if (isSubsequence(query.replaceAll(' ', ''), normalized.replaceAll(' ', ''))) return 25
  return 0
}

export interface ToolSearchResult {
  tool: ToolDefinition
  score: number
}

export function searchTools(allTools: readonly ToolDefinition[], query: string, locale: SupportedLocale): ToolSearchResult[] {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return allTools.map(tool => ({ tool, score: tool.featured ? 10 : 1 }))

  return allTools
    .map((tool) => {
      const content = tool.locales[locale]
      const nameScore = fieldScore(normalizedQuery, content.name)
      const scores = [
        nameScore > 0 ? nameScore + 30 : 0,
        fieldScore(normalizedQuery, content.shortDescription),
        ...content.synonyms.map((synonym) => {
          const synonymScore = fieldScore(normalizedQuery, synonym)
          return synonymScore > 0 ? synonymScore + 10 : 0
        }),
        fieldScore(normalizedQuery, tool.category),
      ]
      return { tool, score: Math.max(...scores) }
    })
    .filter(result => result.score > 0)
    .sort((left, right) => right.score - left.score || left.tool.locales[locale].name.localeCompare(right.tool.locales[locale].name))
}
