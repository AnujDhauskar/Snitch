import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './app.store'
import { routes } from './app.routes'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={routes}/>
    </Provider>
  )
}

export default App
