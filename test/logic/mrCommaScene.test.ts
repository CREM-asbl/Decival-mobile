import { describe, expect, test } from 'vitest'
import { getCrownTier, getMrCommaScene } from '../../src/utils/mrCommaScene'

describe('MrComma scene layout', () => {
  test('normalise le sprite happy et recentre les accessoires du progress avatar', () => {
    const scene = getMrCommaScene('happy')

    expect(scene.image.x).toBeCloseTo(-9.8, 1)
    expect(scene.image.y).toBeCloseTo(-10.9, 1)
    expect(scene.image.width).toBeCloseTo(117.2, 1)
    expect(scene.image.height).toBeCloseTo(117.2, 1)
    expect(scene.glasses.x).toBe(49)
    expect(scene.glasses.y).toBe(31)
    expect(scene.cape.topLeft.x).toBe(34)
    expect(scene.cape.topRight.x).toBe(64)
    expect(scene.crown.x).toBe(50)
    expect(scene.crown.y).toBe(1)
  })

  test('retombe sur la scene par défaut pour une variante inconnue', () => {
    expect(getMrCommaScene('unknown')).toEqual(getMrCommaScene('default'))
  })

  test('affiche la bonne couronne selon le niveau', () => {
    expect(getCrownTier(34)).toBe('none')
    expect(getCrownTier(35)).toBe('silver')
    expect(getCrownTier(49)).toBe('silver')
    expect(getCrownTier(50)).toBe('gold')
  })
})
