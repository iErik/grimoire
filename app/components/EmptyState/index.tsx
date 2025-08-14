import type { ReactNode } from 'react'
import { css, cva } from '@css'


type EmptyStateProps = {
  title: string
  description?: string

  fill?: boolean
  vFill?: boolean
  hFill?: boolean

  children?: ReactNode
}

const EmptyState = (props: EmptyStateProps) => {
  return (
    <div className={styles.root({
      fill: props.fill,
      vFill: props.vFill,
      hFill: props.hFill
    })}>

      <h1 className={styles.title}>
        { props.title }
      </h1>

      { props.children
        ? <section
          className={styles.children}
          children={props.children}
        />
        : <p
          className={styles.description}
          children={props.description}
        />
      }
    </div>
  )
}

export default EmptyState

/*--------------------------------------------------------/
/ -> Styling                                              /
/--------------------------------------------------------*/

const styles = {
  root: cva({
    base: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },

    variants: {
      fill: { true: { height: '100%', width: '100%' } },
      hFill: { true: { width: '100%' } },
      vFill: { true: { height: '100%' } },
    }
  }),

  title: css({
    textStyle: 'titleLg'
  }),

  description: css({
    textStyle: 'body'
  }),

  children: css({ })
}
