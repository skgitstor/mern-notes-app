import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import StateContext from './context/stateContext.jsx'
import FunctionContext from './context/functionContext.jsx'


createRoot(document.getElementById('root')).render(
  <StateContext>
    <FunctionContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FunctionContext>
  </StateContext>
)
