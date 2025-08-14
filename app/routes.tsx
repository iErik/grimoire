import { Route, Switch } from 'wouter'

import RootLayout from '@layouts/Root'
import Journal from '@views/Journal'


export default function Routes() {
  return (
    <RootLayout>
      <Switch>
        <Route path="/" component={Journal} />
      </Switch>
    </RootLayout>
  )
}
