import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';

import HomePage from './pages/HomePage';
import ItemPage, {loader as itemsLoader} from './pages/Items';
import EventDetailPage from './pages/EventDetail';
//import NewFabricPage from './pages/NewFabric';
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
import PaymentSuccess from './pages/PaymentSuccess';
import FabricForm from './components/FabricForm';
import PaymentForm from './components/PaymentForm';

const App=()=> {
  const { token, login, logout, userId, isLoggedIn, isAdmin} = useAuth();
  const {item,totalQuantity,totalAmount,status,orderId,createOrder,updateStatus, clearContext} = useOrder();
  const dispatch=useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(()=>{
        dispatch(fetchCartData(cart));
  },[]);

let routes;
  if (isLoggedIn) {
    routes = (
      <Routes>
      <Route path="/" element={ <RootLayout/>}  >
        <Route index={true} path="/items" element={<ItemPage />}  />
        <Route path="/store/:category" element={<FabricsPage />} />
        <Route path="/fabrics/:fabricId/:category" element={<FabricDetailPage />} />
       // <Route path="/fabrics/:fabricId/:edit" element={<FabricForm />} />
        <Route path="/fabrics/new" element={<FabricForm />} />
        <Route path="/cart" element={<CartPage />}  />
        <Route path="/order/:orderId" element={<OrderPage />}  />
        <Route path="/user" element={<AuthenticationPage />}  />
        <Route path="/payment" element={<PaymentForm />}  />
        <Route path="/paymentsuccess/:rzrOrderId/:paymentId" element={<PaymentSuccess />}  />
        <Route path="/*" element={<ErrorPage />}  />

        {isLoggedIn ? (
              <Route path="/*" element={<Navigate to="/" replace />} />
            ) : (
              <Route path="/*" element={<Navigate to="/auth" replace />} />
            )}
      </Route>
    </Routes>
    );
  }
  else{
     routes = (
      <Routes>
        <Route path="/" element={ <RootLayout/>} >
        <Route  path="/items" element={<ItemPage />}  />
        <Route path="/store/:category" element={<FabricsPage />} />
        <Route path="/fabrics/:fabricId/:category" element={<FabricDetailPage />} />
        <Route path="/cart" element={<CartPage />}  />
        <Route path="/order/:orderId" element={<OrderPage />}  />
        <Route path="/user" element={<AuthenticationPage />}  />
        <Route path="/payment" element={<PaymentForm />}  />
        <Route path="/paymentsuccess/:rzrOrderId/:paymentId" element={<PaymentSuccess />}  />
        <Route path="/*" element={<ErrorPage />}  />

        {/*<Route path="/*" element={<Navigate to="/auth" replace />} />
        {isLoggedIn ? (
          <Route path="/*" element={<Navigate to="/" replace />} />
        ) : (
          <Route path="/*" element={<Navigate to="/auth" replace />} />
        )}*/}

        <Route path="/*" element={<ErrorPage />} />
        </Route>
     </Routes>
    );
  }
  return (
  <AuthContext.Provider
        value={{
          token: token,
          isLoggedIn: isLoggedIn,
          isAdmin: isAdmin,
          userId: userId,
          login: login,
          logout: logout
        }}
  >
    <OrderContext.Provider value={{ item:item||[], totalQuantity:totalQuantity,
                                    totalAmount:totalAmount, status:status, orderId:orderId,
                                    createOrder:createOrder, updateStatus, clearContext}}>
        <Router> {routes} </Router>
    </OrderContext.Provider>
  </AuthContext.Provider>
  );
}

export default App;
