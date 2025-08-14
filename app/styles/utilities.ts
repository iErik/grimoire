import type { UtilityConfig } from '@pandacss/types'


export const utilities: UtilityConfig = {
  btlRadius: {
    className: 'btlRadius',
    values: 'radii',
    transform: v => ({ borderTopLeftRadius: v })
  },
  btrRadius: {
    className: 'btrRadius',
    values: 'radii',
    transform: v => ({ borderTopRightRadius: v })
  },
  bblRadius: {
    className: 'bblRadius',
    values: 'radii',
    transform: v => ({ borderBottomLeftRadius: v })
  },
  bbrRadius: {
    className: 'bbrRadius',
    values: 'radii',
    transform: v => ({ borderBottomRightRadius: v })
  },

  blRadius: {
    className: 'blRadius',
    values: 'radii',
    transform: v => ({
      borderBottomLeftRadius: v,
      borderTopLeftRadius: v
    })
  },
  brRadius: {
    className: 'brRadius',
    values: 'radii',
    transform: v => ({
      borderBottomRightRadius: v,
      borderTopRightRadius: v
    })
  },
  btRadius: {
    className: 'btRadius',
    values: 'radii',
    transform: v => ({
      borderTopRightRadius: v,
      borderTopLeftRadius: v
    })
  },
  bbRadius: {
    className: 'bbRadius',
    values: 'radii',
    transform: v => ({
      borderBottomRightRadius: v,
      borderBottomLeftRadius: v
    })
  }
}
