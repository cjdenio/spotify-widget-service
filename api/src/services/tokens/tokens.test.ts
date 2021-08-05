import { tokens } from './tokens'
import type { StandardScenario } from './tokens.scenarios'

describe('tokens', () => {
  scenario('returns all tokens', async (scenario: StandardScenario) => {
    const result = await tokens()

    expect(result.length).toEqual(Object.keys(scenario.token).length)
  })
})
