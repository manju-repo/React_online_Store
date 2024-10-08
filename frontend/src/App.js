import { useState} from 'react';
import { io } from 'socket.io-client'; // Import the socket.io client

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
import RootLayout from './layout/root';
import ErrorPage from './pages/Error';
import ErrorBoundary  from './components/ErrorBoundary';
import AuthenticationPage from './pages/Authentication';
import OrderPage from './pages/Order';
import OrderItemTrack from './pages/order_item_track';
import { Fragment, useEffect } from 'react';
import Cart from './components/Cart';
import Notification from './components/notification';
import { sendCartData, fetchCartData } from './Store/cart_actions';
import { AuthContext } from './Context/auth-context';
import { useAuth } from './hooks/auth-hook';
import {OrderContext} from './Context/order-context';
import {useOrder} from './hooks/order-hook';
import {WishlistContext} from './Context/wishlist-context';
import {NotificationProvider} from './Context/notification-context';

import PaymentSuccess from './pages/PaymentSuccess';
import FabricForm from './components/FabricForm';
import PaymentForm from './components/PaymentForm';
import ClientOrders from './pages/ClientOrders';
import ProfileForm from './pages/ProfileForm';
import Form2FA from './components/Form2FA';
import ProtectedRoute from './components/ProtectedRoute';
import AutoLogoutRedirect from './autoLogout-redirect';
import SearchItems from './components/SearchItems.js';
import Support from './pages/support';
import Ticket from './pages/Ticket';
import TicketForm from './pages/TicketForm.js';
import SubscriptionForm from './pages/SubscriptionForm.js';
import Notifications from './pages/Notifications';
import NotificationForm from './pages/NotificationForm.js';

const App=()=> {
  const [socket, setSocket] = useState(null);

  const { token, login, logout, userId, isLoggedIn, isAdmin, superAdmin, isSubscribed,setSubscription} = useAuth();
  const {item,totalQuantity,totalAmount,status,orderId, paymentId, createOrder,updateStatus, updateItemDetails, updatePaymentDetails, clearContext} = useOrder();
  const [is2FAuthenticated,setIs2FAuthenticated] = useState(false);
  const [orders,setOrders]=useState([]);
  const [wishlist,setWishlist] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [notifications, setNotifications] = useState([]); // Manage notifications here
  const [Avatar,setAvatar]=useState(null);
  let cartId = null;
  const dispatch=useDispatch();
  const cart = useSelector((state) => state.cart);

/*useEffect(() => {
  const socketIo = io('http://localhost:5000'); // Ensure this matches backend port
  setSocket(socketIo);

  socketIo.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

    socket.emit('register', userId); // Register user ID for receiving notifications

  socketIo.on('notification', (data) => {
    console.log('Notification received:', data.message);
  });

  socketIo.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return () => {
    socketIo.disconnect();
  };
}, []);*/


  useEffect(()=>{
        const fetchUserData=async()=>{
          dispatch(fetchCartData(JSON.parse(localStorage.getItem('cartId'))||null,userId));
          setWishlist(JSON.parse(localStorage.getItem('Wishlist'))||[]);
          const notifications=JSON.parse(localStorage.getItem('Notifications'));
          if(isSubscribed?.pushSubscribed)
              setNotifications(notifications || []);
          else{
              setNotifications([]);
              localStorage.removeItem('Notifications');
          }
          setOrders(JSON.parse(localStorage.getItem('orders'))||[]);
          setAvatar(localStorage.getItem('avatar')||[]);



console.log(isLoggedIn);
    }
    fetchUserData();
  },[dispatch,userId, isSubscribed]);

  useEffect(() => {
      const storedAvatar = localStorage.getItem('avatar');
      if (storedAvatar) {
        setAvatar(storedAvatar);
      }
    }, []);

        const handleAvatarChange = (newAvatar) => {
        console.log("in handleAvatar");
            localStorage.setItem('avatar', newAvatar);
            setAvatar(newAvatar);
          };

      const updateWishlist=(newWishlist)=>{
        setWishlist(newWishlist);
      }

     const modalOpen = (newState) => {
     console.log(showModal);
        setShowModal(newState);
     console.log(showModal);

      };

const router = createBrowserRouter([
  {
    path: '/',
    element:
   //<ErrorBoundary> {/* Wrap your whole app with ErrorBoundary */}
     <RootLayout />,
   //</ErrorBoundary>),

   // errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/homepage', element: <HomePage /> },
      { path: '/items', element: <ItemPage /> },
      { path: '/store/:category' ,element: <FabricsPage />},
      { path: '/store/:category/:sub_category' ,element: <FabricsPage />},
      { path: '/fabrics/:fabricId/:category', element: <FabricDetailPage />},
      { path: '/fabrics/new/:itemCategory', element: <ProtectedRoute element={<FabricForm />} requiredRole="admin" /> },
      { path: '/clientorders', element: <ProtectedRoute element={ <ClientOrders />}/>},
      //{ path: '/clientorders', element: <ClientOrders />},
     // { path: '/Form2FA', element: <Form2FA />} ,
      { path: '/cart', element: <CartPage />},
      { path: '/wishlist', element: <WishlistPage />},
      { path: '/order/:orderId', element: <OrderPage />},
      { path: '/user', element: <AuthenticationPage />},
      { path: '/payment', element: <PaymentForm />},
      { path: '/paymentsuccess/:rzrOrderId/:paymentId', element: <PaymentSuccess />},
      { path: '/order_item_track/:order_id/:item_id', element: <ProtectedRoute element={<OrderItemTrack/> }/>},
      { path: '/userProfile', element: <ProtectedRoute element={<ProfileForm onAvatarChange={handleAvatarChange}/> }/>},
      { path: '/searchItems', element:<SearchItems/>},
      { path: '/support', element:<Support/>},
      { path: '/tickets', element:<Ticket/>},
      { path: '/ticket/new', element: <ProtectedRoute element={<TicketForm/>}/>},
      { path: '/ticket/edit/:ticketId', element: <ProtectedRoute element={<TicketForm/>}/> },
      { path: '/subscribe', element: <ProtectedRoute element={<SubscriptionForm/>}/> },
      { path: '/notifications', element: <ProtectedRoute element={<Notifications/>}/> },
      { path: '/notifications/new', element: <ProtectedRoute element={<NotificationForm/>}/>},
      { path: '/notifications/edit/:notificationId', element: <ProtectedRoute element={<NotificationForm/>}/> }
    ],
  }
]);


  return (
  <AuthContext.Provider value={{    token: token,isLoggedIn: isLoggedIn, isAdmin: isAdmin, superAdmin, Avatar,
                                    userId: userId, isSubscribed, login: login,logout: logout, is2FAuthenticated, setSubscription:setSubscription}}>

    <OrderContext.Provider value={{ item:item||[], totalQuantity:totalQuantity,
                                    totalAmount:totalAmount, status:status, orderId:orderId, paymentId:paymentId,
                                    createOrder:createOrder, updateStatus, clearContext,updateItemDetails, updatePaymentDetails, orders}}>

     <WishlistContext.Provider value={{ wishlist:wishlist||[], updateWishlist, showModal:showModal||false, modalOpen}}>
       <NotificationProvider userId={userId} notifications={notifications} setNotifications={setNotifications}>>
            <RouterProvider  router={router} />
       </NotificationProvider>
     </WishlistContext.Provider>
    </OrderContext.Provider>
  </AuthContext.Provider>
  );
}

export default App;

