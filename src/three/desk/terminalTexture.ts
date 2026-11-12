import { CanvasTexture, SRGBColorSpace } from 'three'
import type { TerminalLine } from '../../content/about'
import { terminalBackground, tokens } from '../palette'

const WIDTH = 960
const HEIGHT = 540
const FONT = '500 30px "JetBrains Mono Variable", ui-monospace, monospace'
const TITLE_FONT = '500 22px "JetBrains Mono Variable", ui-monospace, monospace'
const LINE_HEIGHT = 44
const MARGIN = 44
const TITLE_BAR = 64
const FIRST_LINE = 118
const PROMPT_WIDTH = 36
/** Pauses, comptées en caractères, avant et après l'affichage d'une réponse. */
const PAUSE_BEFORE_OUTPUT = 7
const PAUSE_AFTER_OUTPUT = 12

/**
 * Le terminal du moniteur : un canvas 2D utilisé comme texture, redessiné
 * seulement quand un caractère s'ajoute ou que le curseur clignote.
 * `total` est la longueur de la séquence complète, pauses comprises.
 */
export function createTerminal(title: string, lines: TerminalLine[]) {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')!
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4

  const total = lines.reduce((sum, line) => sum + line.cmd.length + PAUSE_BEFORE_OUTPUT + PAUSE_AFTER_OUTPUT, 0)

  function draw(progress: number, cursorOn: boolean) {
    ctx.fillStyle = terminalBackground
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = tokens.bg200
    ctx.fillRect(0, 0, WIDTH, TITLE_BAR)
    ctx.font = TITLE_FONT
    ctx.textBaseline = 'middle'
    ctx.fillStyle = tokens.inkFaint
    ctx.fillText(title, MARGIN, TITLE_BAR / 2 + 1)

    ctx.font = FONT
    let y = FIRST_LINE
    let remaining = progress
    let cursorX = MARGIN
    let cursorY = y
    let finished = true

    for (const line of lines) {
      const typed = Math.min(line.cmd.length, Math.max(0, Math.floor(remaining)))
      const command = line.cmd.slice(0, typed)
      ctx.fillStyle = tokens.mint
      ctx.fillText('$', MARGIN, y)
      ctx.fillStyle = tokens.ink
      ctx.fillText(command, MARGIN + PROMPT_WIDTH, y)
      cursorX = MARGIN + PROMPT_WIDTH + ctx.measureText(command).width
      cursorY = y
      remaining -= line.cmd.length + PAUSE_BEFORE_OUTPUT
      if (remaining < 0) {
        finished = false
        break
      }
      y += LINE_HEIGHT
      ctx.fillStyle = tokens.inkMuted
      ctx.fillText(line.out, MARGIN, y)
      y += LINE_HEIGHT
      remaining -= PAUSE_AFTER_OUTPUT
      if (remaining < 0) {
        finished = false
        cursorX = -1
        break
      }
    }

    if (finished) {
      ctx.fillStyle = tokens.mint
      ctx.fillText('$', MARGIN, y)
      cursorX = MARGIN + PROMPT_WIDTH
      cursorY = y
    }
    if (cursorOn && cursorX >= 0) {
      ctx.fillStyle = tokens.mint
      ctx.fillRect(cursorX + 2, cursorY - 17, 16, 34)
    }
    texture.needsUpdate = true
  }

  return { texture, draw, total }
}
