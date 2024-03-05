import { useSelector, useDispatch } from 'react-redux';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsPage from './pages/Events';
import EventDetailPage from './pages/EventDetail';
import NewEventPage from './pages/NewEvent';
import EditEventPage from './pages/EditEvent';
import FabricsPage from './pages/Fabrics';
import FabricDetailPage from './components/FabricDetail';
import CartPage from './components/Cart';
import RootLayout from './pages/root';
//import Layout from './layout/Layout';
import { Fragment, useEffect } from 'react';
import Cart from './components/Cart';
import Notification from './components/notification';
import { sendCartData, fetchCartData } from './Store/cart_actions';

let isInitial = true;

const router=createBrowserRouter([
    {
    path:'/',

    element:<RootLayout/>,
    children:[
    {index:true,element:<EventsPage/>},
    {path:'items',element:<EventsPage/>},
    {path:'items/:itemId',element:<EventDetailPage/>},
    {path:'events/new',element:<NewEventPage/>},
    {path:'events/:eventId/edit',element:<EditEventPage/>},
    {path:'fabrics/:cat',element:<FabricsPage/>},
    {path:'fabric/:fabricId',element:<FabricDetailPage/>},
    {path:'cart/',element:<CartPage/>},

],
},
]);

function App() {
  return (
  <RouterProvider router={router}/>
  );
}

export default App;
