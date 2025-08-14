import type { PropsWithChildren } from 'react'
import { css } from '@css'

export default function RootLayout(props: PropsWithChildren) {
  return (
    <div className={styles.root}>
      {props.children}
    </div>
  )
}

/*--------------------------------------------------------/
/ -> Styling                                              /
/--------------------------------------------------------*/

const styles = {
  root: css({
    width: '100%',
    height: '100%'
  })
}
