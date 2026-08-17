import { afterEach, describe, expect, test } from 'vitest'
import { clearActiveElementFocus } from '../../src/utils/clearActiveElementFocus'

describe('ComparisonTest focus reset', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('retire le focus de l’élément actif avant d’afficher la question suivante', () => {
    document.body.innerHTML = '<button type="button">17</button>'
    const button = document.querySelector('button')

    button.focus()
    expect(document.activeElement).toBe(button)

    clearActiveElementFocus()

    expect(document.activeElement).not.toBe(button)
  })
})
