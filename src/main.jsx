import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter,createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Programs from './pages/Programs/Programs.jsx'
import Login from './pages/Login/Login.jsx'
import Mission from './pages/Mission/Mission.jsx'
import Tools from './pages/AiTools/Tools.jsx'
import Testimonials from './pages/Testimonials/Testimonials.jsx'




const router = createBrowserRouter(
  createRoutesFromElements (
 <Route path='/' element={<App/>}>
    <Route index element={<Programs/>}/>
    <Route path='/programs' element={<Programs/>}/>
    <Route path='/mission' element={<Mission/>}/>
    <Route path='/tools' element={<Tools/>}/>
    <Route path='/testimonials' element={<Testimonials/>}/>
    <Route path='/login' element={<Login/>}/>
 </Route>
  ))

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
  ,
)
