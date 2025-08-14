import { syntaxTree } from '@codemirror/language'
import {
  type EditorState,
  type Range,
  RangeSet,
  StateField
} from '@codemirror/state'

import {
  type DecorationSet,
  Decoration,
  EditorView,
  WidgetType
} from '@codemirror/view'

import markdoc, { type Config } from '@markdoc/markdoc'

import { hashString } from './utils'



const RENDERABLE_NODE_TYPES = [
  'Table',
  'Blockquote',
  'MarkdocTag'
] as const



function isRenderableNodeType(
  nodeName: string
): nodeName is (typeof RENDERABLE_NODE_TYPES)[number] {
  return (RENDERABLE_NODE_TYPES as readonly string[])
    .includes(nodeName)
}

// Cache for rendered widget HTML to avoid re-parsing
// identical content
const widgetCache = new Map<string, string>()

const defaultConfig: Config = {
  nodes: {
    blockquote: {
      render: 'blockquote',
      transform(node, config) {
        const children = node.transformChildren(config)
        return new markdoc.Tag('blockquote', {}, children)
      },
    },
    paragraph: {
      render: 'p',
      transform(node, config) {
        const children = node.transformChildren(config)
        return new markdoc.Tag('p', {}, children)
      },
    },
    softbreak: {
      render: 'br',
      transform() {
        return new markdoc.Tag('br', {})
      },
    },
    hardbreak: {
      render: 'br',
      transform() {
        return new markdoc.Tag('br', {})
      },
    },
  },
};

const patternTag =
  /{%\s*(?<closing>\/)?(?<tag>[a-zA-Z0-9-_]+)(?<attrs>\s+[^]+)?\s*(?<self>\/)?%}\s*$/m


class RenderBlockWidget extends WidgetType {
  rendered: string

  constructor(
    public source: string,
    config: Config
  ) {
    super()

    const cacheKey = hashString(source)
    const cachedResult = widgetCache.get(cacheKey)
    if (cachedResult) {
      this.rendered = cachedResult
      return
    }

    const mergedConfig = {
      ...defaultConfig,
      nodes: { ...defaultConfig.nodes, ...config.nodes },
      tags: { ...defaultConfig.tags, ...config.tags },
    }

    const document = markdoc.parse(source)
    const transformed = markdoc
      .transform(document, mergedConfig);

    this.rendered = markdoc.renderers.html(transformed)

    widgetCache.set(cacheKey, this.rendered)
  }

  eq(widget: RenderBlockWidget): boolean {
    return this.source === widget.source
  }

  toDOM(): HTMLElement {
    const content = document.createElement('div')
    content.setAttribute('contenteditable', 'false')
    content.className = 'cm-markdoc-renderBlock'
    content.innerHTML = this.rendered
    return content
  }

  ignoreEvent(): boolean {
    return false
  }
}

function replaceBlocks(
  state: EditorState,
  config: Config,
  from?: number,
  to?: number
) {
  const decorations: Range<Decoration>[] = []
  const [cursor] = state.selection.ranges

  const tags: [number, number][] = []
  const stack: number[] = []

  syntaxTree(state).iterate({
    from,
    to,
    enter(node) {
      if (!isRenderableNodeType(node.name)) {
        return true;
      }

      if (node.name === 'MarkdocTag') {
        const text = state.doc
          .sliceString(node.from, node.to)
        const match = text.match(patternTag)

        if (match?.groups?.self) {
          tags.push([node.from, node.to])
          return true
        }

        if (match?.groups?.closing) {
          const last = stack.pop()

          if (last) {
            tags.push([last, node.to])
          }

          return true
        }

        stack.push(node.from)
        return true
      }

      if (cursor.from >= node.from && cursor.to <= node.to) {
        return false
      }

      const text = state.doc.sliceString(node.from, node.to)
      const decoration = Decoration.replace({
        widget: new RenderBlockWidget(text, config),
        block: true,
      })

      decorations.push(decoration.range(node.from, node.to))
      return true
    },
  })

  for (const [from, to] of tags) {
    if (cursor.from >= from && cursor.to <= to) {
      continue
    }

    const text = state.doc.sliceString(from, to)
    const decoration = Decoration.replace({
      widget: new RenderBlockWidget(text, config),
      block: true,
    })

    decorations.push(decoration.range(from, to))
  }

  return decorations
}

export default function (config: Config) {
  return StateField.define<DecorationSet>({
    create(state) {
      return RangeSet.of(replaceBlocks(state, config), true)
    },

    update(oldDecorations, transaction) {
      // Optimize selection-only changes by checking if
      // cursor entered/exited blocks
      if (!transaction.docChanged && transaction.selection) {
        const oldCursor = transaction
          .startState.selection.main
        const newCursor = transaction.state.selection.main
        const oldTree = syntaxTree(transaction.startState)

        let cursorCrossedBlockBoundary = false
        oldTree.iterate({
          enter(node) {
            if (isRenderableNodeType(node.name)) {
              const oldInBlock =
                oldCursor.from >= node.from && oldCursor.to <= node.to
              const newInBlock =
                newCursor.from >= node.from && newCursor.to <= node.to

              if (oldInBlock !== newInBlock) {
                cursorCrossedBlockBoundary = true
                return false
              }
            }
            return true;
          },
        });

        // Use fast path if cursor didn't cross block boundaries
        if (!cursorCrossedBlockBoundary) {
          return oldDecorations.map(transaction.changes)
        }
      }

      // Full recomputation needed
      return RangeSet.of(
        replaceBlocks(transaction.state, config),
        true
      )
    },

    provide(field) {
      return EditorView.decorations.from(field)
    },
  })
}
