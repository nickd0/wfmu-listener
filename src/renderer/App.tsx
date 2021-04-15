import React from 'react'
import { render } from 'react-dom'
import { GlobalStyle } from './styles/GlobalStyle'

import AppContainer from './components/AppContainer'
import { Provider } from 'react-redux'
import store from './store'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer />
    </>
  )
}

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

render(<Root />, mainElement)
