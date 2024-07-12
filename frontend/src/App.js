import { useState} from 'react';
import { createBrowserRouter ,RouterProvider, Route, Navigate, Routes } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';

import HomePage from './pages/HomePage';
import ItemPage, {loader as itemsLoader} from './pages/Items';
import EventDetailPage from './pages/EventDetail';
import WishlistPage from './components/wishlist';
//import EditFabricPage from './pages/EditFabric';
import FabricsRootPage from './pages/FabricsRoot';
import FabricsPage from './pages/Fabrics';
import FabricDetailPage from './components/FabricDetail';
import {action as manipulateFabricAction} from './components/FabricForm';
import CartPage from './components/Cart';
import RootLayout from './pages/root';
import ErrorPage from './pages/Error';
import AuthenticationPage from './pages/Authentication';
import OrderPage from './pages/Order';
import { Fragment, useEffect } from 'react';
import Cart from './components/Cart';
import Notification from './components/notification';
import { sendCartData, fetchCartData } from './Store/cart_actions';
import { AuthContext } from './Context/auth-context';
import { useAuth } from './hooks/auth-hook';
import {OrderContext} from './Context/order-context';
import {useOrder} from './hooks/order-hook';
import {WishlistContext} from './Context/wishlist-context';
import PaymentSuccess from './pages/PaymentSuccess';
import FabricForm from './components/FabricForm';
import PaymentForm from './components/PaymentForm';
import ClientOrders from './pages/ClientOrders'
import Form2FA from './components/Form2FA';
import ProtectedRoute from './components/ProtectedRoute';

const App=()=> {
  const { token, login, logout, userId, isLoggedIn, isAdmin} = useAuth();
  const {item,totalQuantity,totalAmount,status,orderId,createOrder,updateStatus, clearContext} = useOrder();
  const [is2FAuthenticated,setIs2FAuthenticated] = useState(false);
  const [orders,setOrders]=useState([]);
  const [wishlist,setWishlist] = useState([]);
  let cartId = null;
  const dispatch=useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(()=>{
        const fetchUserData=async()=>{
          dispatch(fetchCartData(JSON.parse(localStorage.getItem('cartId'))||null,userId));
          setWishlist(JSON.parse(localStorage.getItem('Wishlist'))||[]);
          setOrders(JSON.parse(localStorage.getItem('orders'))||[]);
console.log(isLoggedIn);
    }
    fetchUserData();
  },[userId]);



      const updateWishlist=(newWishlist)=>{
        setWishlist(newWishlist);
      }

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/homepage', element: <HomePage /> },
      { path: '/items', element: <ItemPage /> },
      { path: '/store/:category' ,element: <FabricsPage />},
      { path: '/store/:category/:sub_category' ,element: <FabricsPage />},
      { path: '/fabrics/:fabricId/:category', element: <FabricDetailPage />},
        { path: '/fabrics/new/:itemCategory', element: <ProtectedRoute element={<FabricForm />} requiredRole="admin" /> },
        { path: '/clientorders', element: <ClientOrders /> },
     // { path: '/Form2FA', element: <Form2FA />} ,
      { path: '/cart', element: <CartPage />},
      { path: '/wishlist', element: <WishlistPage />},
      { path: '/order/:orderId', element: <OrderPage />},
      { path: '/user', element: <AuthenticationPage />},
      { path: '/payment', element: <PaymentForm />},
      { path: '/paymentsuccess/:rzrOrderId/:paymentId', element: <PaymentSuccess />}
    ],
  }
]);


  return (
  <AuthContext.Provider value={{    token: token,isLoggedIn: isLoggedIn, isAdmin: isAdmin,
                                    userId: userId,login: login,logout: logout, is2FAuthenticated}}>

    <OrderContext.Provider value={{ item:item||[], totalQuantity:totalQuantity,
                                    totalAmount:totalAmount, status:status, orderId:orderId,
                                    createOrder:createOrder, updateStatus, clearContext, orders}}>

     <WishlistContext.Provider value={{ wishlist:wishlist||[], updateWishlist}}>

        <RouterProvider  router={router} />

     </WishlistContext.Provider>
    </OrderContext.Provider>
  </AuthContext.Provider>
  );
}

export default App;
