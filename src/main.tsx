import { createRoot } from 'react-dom/client'
import './index.css'
import MainRoute from './routes/index.tsx'
import { RouterProvider } from 'react-router-dom'

const {router} = MainRoute()

createRoot(document.getElementById('root')!).render(
  // <ChakraProvider toastOptions={{defaultOptions: {position: "top"}}}>
    <RouterProvider router={router}/> 
//  </ChakraProvider>
)
