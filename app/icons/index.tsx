import React, { type SVGProps } from 'react'
import * as Icons from '@icons/components'


export type IconName = keyof typeof Icons

export type IconProps = SVGProps<SVGSVGElement> & {
  icon: IconName
  size?: number
  className?: string
}

const DEFAULT_SIZE = 24

export default function Icon({
  icon,
  size,
  className,
  ...props
}: IconProps) {
  const icnSize = size || DEFAULT_SIZE

  const Component = React.createElement(Icons[icon], {
    ...props,
    width: icnSize,
    height: icnSize
  })

  return (
    <span className={className}>
      { Component }
    </span>
  )
}
