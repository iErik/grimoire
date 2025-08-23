import type { PropsWithChildren } from 'react'
import { css } from '@css'

import Draggable from '@components/Draggable'

export default function RootLayout(props: PropsWithChildren) {
  return (
    <div className={styles.root}>
      <Draggable.Provider>
        {props.children}
      </Draggable.Provider>
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
