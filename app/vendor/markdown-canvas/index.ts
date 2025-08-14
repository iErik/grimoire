import { cursorLineDown, cursorLineUp } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { syntaxHighlighting, syntaxTree } from '@codemirror/language'
import { ViewPlugin, keymap } from '@codemirror/view'

import type { Config } from '@markdoc/markdoc'

import highlightStyle from './highlightStyle'
import renderBlock from './renderBlock'
import RichEditPlugin from './richEdit'
import tagParser from './tagParser'



export type MarkdocPluginConfig = {
  lezer?: any;
  markdoc: Config
};

function findBlockAt(
  state: any,
  pos: number
): { from: number; to: number } | null {
  const tree = syntaxTree(state)
  let result: { from: number; to: number } | null = null

  tree.iterate({
    enter(node) {
      // TODO: Similar snippet is found at 'renderBlock.ts'
      const isRenderableNode = [
        'Table',
        'Blockquote',
        'MarkdocTag'
      ].includes(node.name)

      if (isRenderableNode) {
        if (pos >= node.from && pos <= node.to) {
          result = { from: node.from, to: node.to }
          return false
        }
      }

      return true
    },
  })

  return result
}

function customCursorUp(view: any): boolean {
  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)

  // Check if we're currently inside a block - if so,
  // use default behavior
  const currentBlock = findBlockAt(view.state, from)
  if (currentBlock) {
    return cursorLineUp(view)
  }

  // If we're not on the first line, check the line above
  if (line.number > 1) {
    const prevLine = view.state.doc.line(line.number - 1)
    const colOffset = from - line.from;
    const targetPos = Math.min(
      prevLine.from + colOffset,
      prevLine.to
    );

    // Check if target position is in a block
    const block = findBlockAt(view.state, targetPos);

    if (block) {
      // Position cursor inside the block to make it editable
      const blockText = view.state.doc
        .sliceString(block.from, block.to)
      const blockLines = blockText.split('\n')
      const lastLine = blockLines[blockLines.length - 1]
      const lastLineStart = block.to - lastLine.length
      const targetInBlock = Math
        .min(lastLineStart + colOffset, block.to - 1)

      view.dispatch({
        selection: {
          anchor: Math.max(targetInBlock, block.from)
        },
        scrollIntoView: true,
      })

      return true
    }
  }

  // Fall back to default behavior
  return cursorLineUp(view)
}

function customCursorDown(view: any): boolean {
  const { from } = view.state.selection.main
  const line = view.state.doc.lineAt(from)

  // Check if we're currently inside a block - if so,
  // use default behavior
  const currentBlock = findBlockAt(view.state, from)
  if (currentBlock) {
    return cursorLineDown(view)
  }

  // If we're not on the last line, check the line below
  if (line.number < view.state.doc.lines) {
    const nextLine = view.state.doc.line(line.number + 1)
    const colOffset = from - line.from
    const targetPos = Math
      .min(nextLine.from + colOffset, nextLine.to)

    // Check if target position is in a block
    const block = findBlockAt(view.state, targetPos)

    if (block) {
      // Position cursor inside the block to make it editable
      const blockText = view.state.doc
        .sliceString(block.from, block.to)
      const blockLines = blockText.split('\n')
      const firstLineEnd = block.from + blockLines[0].length
      const targetInBlock = Math
        .min(block.from + colOffset, firstLineEnd)

      view.dispatch({
        selection: { anchor: targetInBlock },
        scrollIntoView: true,
      })

      return true
    }
  }

  // Fall back to default behavior
  return cursorLineDown(view)
}

export default function (config: MarkdocPluginConfig) {
  const mergedConfig = {
    ...(config.lezer ?? []),
    extensions: [
      tagParser,
      ...(config.lezer?.extensions ?? [])
    ],
  }

  return ViewPlugin.fromClass(RichEditPlugin, {
    decorations: plugin => plugin.decorations,

    provide: _plugin => [
      renderBlock(config.markdoc),
      syntaxHighlighting(highlightStyle),
      markdown(mergedConfig),
      keymap.of([
        { key: 'ArrowUp', run: customCursorUp },
        { key: 'ArrowDown', run: customCursorDown },
      ]),
    ],

    eventHandlers: {
      mousedown({ target }, view) {
        if (
          target instanceof Element &&
          target.matches('.cm-markdoc-renderBlock *')
        ) {
          view.dispatch({
            selection: { anchor: view.posAtDOM(target) }
          })
        }
      },
    },
  })
}
