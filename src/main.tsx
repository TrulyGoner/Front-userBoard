import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@store'
import { ErrorProvider } from '@shared/contexts'
import '@shared/styles/global.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorProvider>
          <App />
        </ErrorProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
