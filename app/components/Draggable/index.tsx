import type { JSX, ReactNode, FC } from 'react'
import {
  createContext,
  createElement,
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
  memo
} from 'react'

import { createPortal } from 'react-dom'

import { css } from '@css'

/*--------------------------------------------------------/
/ -> Context                                              /
/--------------------------------------------------------*/

type Point = {
  x: number
  y: number
}

type DragHandle = FC<{ activeArea: string }>

type DragPayload<T> = {
  type: string,
  data: T
}

type ActiveDrag = {
  renderElement: DragHandle | null
  active: boolean
  payload: DragPayload<any> | null
  initialPos: Point | null
}

type DragContext = {
  activeDrag: ActiveDrag
  activeDragArea: string | null

  setActiveDrag: (
    payload: DragPayload<any>,
    rc: DragHandle,
    initialPos: Point
  ) => any

  clearActiveDrag: () => void

  setActiveDragArea: (name: string) => void
}


const DragContext = createContext<DragContext>({
  activeDragArea: null,

  activeDrag: {
    renderElement: null,
    active: false,
    payload: null,
    initialPos: null
  },

  clearActiveDrag: () => {},
  setActiveDrag: () => {},
  setActiveDragArea: () => {}
})


// 1 - Element to be rendered when drag starts
// 2 - Which drag regions react to that given element
// 3 - Function to be executed when element is dropped
// 4 - ESC Key handling
type ProviderProps = {
  children: ReactNode
}

const Provider = (props: ProviderProps) => {
  const [
    activeDrag,
    _setActiveDrag
  ] = useState<ActiveDrag>({
    renderElement: null,
    active: false,
    payload: null,
    initialPos: null
  })

  const [
    activeDragArea,
    setActiveDragArea
  ] = useState<string>('')

  const setActiveDrag = useCallback((
    payload: DragPayload<any>,
    renderElement: DragHandle,
    initialPos: Point
  ) => {
    _setActiveDrag({
      payload,
      renderElement,
      active: true,
      initialPos
    })
  }, [])

  const clearActiveDrag = useCallback(() => _setActiveDrag({
    renderElement: null,
    payload: null,
    active: false,
    initialPos: null
  }), [])

  const contextValue = useMemo(() => ({
    activeDrag,
    setActiveDrag,
    clearActiveDrag,

    activeDragArea,
    setActiveDragArea
  }), [
    activeDrag,
    activeDragArea,
    setActiveDragArea,
    setActiveDrag
  ])

  return (
    <DragContext.Provider value={contextValue}>
      { props.children }
      { createPortal(<DragHandleWrapper />, document.body) }
    </DragContext.Provider>
  )
}

export const useDragContext = () => {
  const ctx = useContext(DragContext)

  if (!ctx) {
    console.error(
      'useDragContext hook used outside a ' +
      'Draggable Context Prodiver!')

    return null
  }

  return ctx
}

/*--------------------------------------------------------/
/ -> Components                                           /
/--------------------------------------------------------*/

// IDEA - Drag identifiers to identify types of draggable
// components, so that each drag area can chose what types
// of draggable components it accepts

type DraggableProps = {
  children: JSX.Element
  dragHandle: () => ReactNode
  onDrag: () => any
}

// If we want to listen to the child element's 'click'
// event, we need to get a reference to that element
// somehow. The clear alternative to that would be to just
// wrap the child element within a div and use a 'click'
// listener on that div
const WithRef = (props: DraggableProps) => {

  return (
    <>
      { props.children }
    </>
  )
}

type DragAreaProps = {
  acceptedTypes: string[],
  children: ReactNode
}

const DragArea = (props: DragAreaProps) => {
  const context = useDragContext()

  useEffect(() => {

    return () => {

    }
  }, [])

  return (
    <>
      { props.children }
    </>
  )
}

const DragHandleWrapper = memo(() => {
  const {
    activeDrag,
    activeDragArea,
    clearActiveDrag
  } = useContext(DragContext)

  const [ mousePos, setMousePos ] = useState<Point>({
    x: activeDrag.initialPos?.x || 0,
    y: activeDrag.initialPos?.y || 0,
  })

  const onMouseMove = (ev: MouseEvent) => setMousePos({
    x: ev.clientX,
    y: ev.clientY
  })

  const onMouseUp = () => clearActiveDrag()

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const Handle = activeDrag.renderElement
    ? memo(activeDrag.renderElement)
    : null

  if (!Handle) return null

  return (
    <div
      className={styles.handleWrapper}
      style={{
        top: `${mousePos.y}px`,
        left: `${mousePos.x}px`
      }}
    >
      <Handle activeArea={activeDragArea || ''} />
    </div>
  )
})

/*--------------------------------------------------------/
/ -> Hook                                                 /
/--------------------------------------------------------*/

// Draggable contract by Draggable "Type"
type UseDraggableOptions<T> = {
  renderEl: DragHandle
  payload: DragPayload<T>,

  onDrop?: () => any
  onDragStart?: () => any
}

export const useDraggable = <T extends HTMLElement, D >(
  options: UseDraggableOptions<D>
) => {
  const elRef = useRef<T | null>(null)
  const context = useDragContext()
  if (!context) {
    console.error(
      'useDraggable: Can\'t find Draggable Context'
    )

    return
  }

  const onMouseDown = (ev: MouseEvent) => {
    context.setActiveDrag(
      options.payload,
      options.renderEl,
      { x: ev.clientX, y: ev.clientY }
    )
  }

  useEffect(() => {
    const el = elRef.current
    if (el) {
      el.addEventListener('mousedown', onMouseDown)
    }

    return () => {
      const el = elRef.current
      if (!el) return

      el.removeEventListener('mousedown', onMouseDown)
    }
  }, [ elRef.current ])

  return (el: T | null) => {
    if (!el) return
    elRef.current = el
  }
}


type UseDragAreaOptions = {
  accept: (payload: DragPayload<any>) => boolean
  onDrop: (payload: DragPayload<any>) => any,
  areaName: string
}

export const useDragArea = <T extends HTMLElement>(
  options: UseDragAreaOptions
) => {
  const dragRef = useRef<T | null>(null)
  const context = useDragContext()

  if (!context) {
    console.error(
      'useDraggable: Can\'t find Draggable Context'
    )

    return
  }

  const activeAreaRef = useRef(context.activeDragArea)

  const onMouseEnter = () => {
    //const activeArea = context.activeDragArea
    const activeArea = activeAreaRef.current
    if (activeArea === options.areaName)
      return

    context.setActiveDragArea(options.areaName)
  }

  const onMouseLeave = () => {
    const activeArea = activeAreaRef.current
    if (activeArea !== options.areaName)
      return

    context.setActiveDragArea('')
  }

  const onMouseUp = () => {}

  const clearEventListeners = () => {
    const el = dragRef.current
    if (!el) return

    el.removeEventListener('mouseenter', onMouseEnter)
    el.removeEventListener('mouseleave', onMouseLeave)
    el.removeEventListener('mouseup', onMouseUp)
  }

  const bindEventListeners = () => {
    const el = dragRef.current
    if (!el) return

    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('mouseup', onMouseUp)
  }

  useEffect(() => {
    const active = context.activeDrag.active
    if (!active) {
      clearEventListeners()
    } else {
      const { payload } = context.activeDrag

      if (payload && options.accept(payload))
        bindEventListeners()
    }

    return () => { clearEventListeners() }
  }, [ context.activeDrag.active ])

  useEffect(() => {
    activeAreaRef.current = context.activeDragArea
  }, [ context.activeDragArea ])

  return (el: T | null) => {
    if (!el) return
    dragRef.current = el
  }
}

/*--------------------------------------------------------/
/ -> Styling                                              /
/--------------------------------------------------------*/

const styles = {
  handleWrapper: css({
    position: 'fixed',
    pointerEvents: 'none',
    userSelect: 'none'
  })
}


/*--------------------------------------------------------/
/ -> Exports                                              /
/--------------------------------------------------------*/

export default {
  WithRef,
  Area: DragArea,
  Provider
}
