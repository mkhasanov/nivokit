import { describe, expect, it } from 'vitest'
import { tools } from '../shared/tools'
import { searchTools } from '../app/utils/search'

describe('tool search', () => {
  it('finds a tool by its primary name', () => {
    const results = searchTools(tools, 'resize image', 'en')
    expect(results[0]?.tool.id).toBe('resize-image')
  })

  it('finds a tool by a user-focused synonym', () => {
    const results = searchTools(tools, 'scale picture', 'en')
    expect(results[0]?.tool.id).toBe('resize-image')
  })

  it('tolerates missing characters', () => {
    const results = searchTools(tools, 'rsze imge', 'en')
    expect(results[0]?.tool.id).toBe('resize-image')
  })

  it('returns no unrelated live tools', () => {
    expect(searchTools(tools, 'merge spreadsheet', 'en')).toEqual([])
  })
})
