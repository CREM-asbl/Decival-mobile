export type MrCommaVariant = 'default' | 'happy' | 'pointing' | 'confused'
export type CrownTier = 'none' | 'silver' | 'gold'

type SourceBounds = {
  left: number
  top: number
  right: number
  bottom: number
}

type Point = {
  x: number
  y: number
}

type CapeLayout = {
  topLeft: Point
  topRight: Point
  bottomRight: Point
  bottomLeft: Point
}

export type MrCommaScene = {
  image: {
    x: number
    y: number
    width: number
    height: number
  }
  glasses: Point
  cape: CapeLayout
  crown: Point
}

const ARTBOARD_SIZE = 1024
const CHARACTER_FRAME = {
  x: 22,
  y: 7.6,
  height: 84,
}

const SOURCE_BOUNDS: Record<MrCommaVariant, SourceBounds> = {
  default: { left: 267, top: 169, right: 757, bottom: 855 },
  happy: { left: 278, top: 162, right: 746, bottom: 896 },
  pointing: { left: 200, top: 194, right: 824, bottom: 830 },
  confused: { left: 275, top: 102, right: 758, bottom: 884 },
}

const roundToTenth = (value: number) => Math.round(value * 10) / 10

function createImagePlacement(bounds: SourceBounds) {
  const visibleHeight = bounds.bottom - bounds.top
  const scale = (CHARACTER_FRAME.height * ARTBOARD_SIZE) / visibleHeight

  return {
    x: roundToTenth(CHARACTER_FRAME.x - (bounds.left / ARTBOARD_SIZE) * scale),
    y: roundToTenth(CHARACTER_FRAME.y - (bounds.top / ARTBOARD_SIZE) * scale),
    width: roundToTenth(scale),
    height: roundToTenth(scale),
  }
}

const BASE_CAPE: CapeLayout = {
  topLeft: { x: 34, y: 38 },
  topRight: { x: 64, y: 38 },
  bottomRight: { x: 84, y: 100 },
  bottomLeft: { x: 16, y: 100 },
}

const SCENES: Record<MrCommaVariant, MrCommaScene> = {
  default: {
    image: createImagePlacement(SOURCE_BOUNDS.default),
    glasses: { x: 48, y: 32 },
    cape: BASE_CAPE,
    crown: { x: 50, y: 1 },
  },
  happy: {
    image: createImagePlacement(SOURCE_BOUNDS.happy),
    glasses: { x: 49, y: 31 },
    cape: BASE_CAPE,
    crown: { x: 50, y: 1 },
  },
  pointing: {
    image: createImagePlacement(SOURCE_BOUNDS.pointing),
    glasses: { x: 43, y: 32 },
    cape: BASE_CAPE,
    crown: { x: 49, y: 1 },
  },
  confused: {
    image: createImagePlacement(SOURCE_BOUNDS.confused),
    glasses: { x: 48, y: 32 },
    cape: BASE_CAPE,
    crown: { x: 50, y: 1 },
  },
}

export function getMrCommaScene(variant: string): MrCommaScene {
  return SCENES[variant as MrCommaVariant] ?? SCENES.default
}

export function getCrownTier(level: number): CrownTier {
  if (level >= 50) return 'gold'
  if (level >= 35) return 'silver'
  return 'none'
}
