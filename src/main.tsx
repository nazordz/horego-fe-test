import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.scss'
import { Provider } from 'react-redux'
import { persistor, store } from './store/index.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename='/'>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
