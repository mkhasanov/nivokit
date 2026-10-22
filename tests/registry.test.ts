import { describe, expect, it } from 'vitest'
import { getPublishedRoutes, getToolPath, supportedLocales, tools } from '../shared/tools'

describe('published route registry', () => {
  it('publishes only reviewed locales', () => {
    expect(supportedLocales).toEqual(['en'])
    expect(getPublishedRoutes().every(route => route.startsWith('/en/'))).toBe(true)
  })

  it('contains unique routes for live tools', () => {
    const routes = tools.map(tool => getToolPath(tool, 'en'))
    expect(new Set(routes).size).toBe(routes.length)
    expect(routes).toEqual(['/en/image/resize-image'])
  })

  it('does not publish unfinished tool URLs', () => {
    const routes = getPublishedRoutes().join('\n')
    expect(routes).not.toContain('merge-pdf')
    expect(routes).not.toContain('compress-image')
    expect(routes).not.toContain('/ru/')
  })
})
