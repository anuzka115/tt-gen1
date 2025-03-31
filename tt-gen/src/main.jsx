import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './App.jsx'
import Admin from './Admin.jsx'
import Faculty from './Faculty.jsx'
import Edit from './Edit.jsx'
import View from './ViewTT.jsx'
import Student from './Student.jsx'
import Login from './Login.jsx'
import Generated from './Generated.jsx'

const router=createBrowserRouter([
  {
    path:"/",
    element:<App/>,
  },
  {
    path:"login/signup",
    element:<Login/>,
  },
  {
    path:"student",
    element:<Student/>,
  },
  {
    path:"faculty",
    element:<Faculty/>,
  },
  {
    path:"admin",
    element:<Admin/>,
  },
  {
    path:"/admin/edit",
    element:<Edit/>,
  },
  {
    path:"/admin/view",
    element:<View/>,
  },
  {
    path:"/admin/edit/generated",
    element:<Generated/>,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <RouterProvider router={router} />
  </StrictMode>,
)
