
import {useState, useEffect, useCallback, useContext} from 'react';

let logoutTimer;
export const useAuth=()=>{
    const [token, setToken]= useState(null);
    const [tokenExpirationDate, setTokenExpirationDate]= useState(null);
    const [userId, setUserId]= useState(null);
    const [isLoggedIn, setIsLoggedIn]= useState(false);
    const [isAdmin, setIsAdmin]= useState(false);
    const [superAdmin, setSuperAdmin]= useState(false);
    const [isSubscribed,setIsSubscribed]= useState(null);

    const setSubscription=useCallback((subscription)=>{
        console.log('setting notification pref ',subscription);
        setIsSubscribed(subscription);
    });

    const login=useCallback((uid, token, expirationDate,userType,super_admin, isSubscribed)=> {
    console.log(uid, expirationDate, userType, isSubscribed);

    /*if(super_admin===null)
          super_admin=JSON.parse(localStorage.getItem('superAdmin'))||false;
      if(isSubscribed===null)
        isSubscribed=JSON.parse(localStorage.getItem('isSubscribed'));
    console.log(super_admin, isSubscribed);*/
      setToken(token);
      setUserId(uid);
      setIsLoggedIn(true);
      setIsAdmin(userType==='admin');
      setIsSubscribed(isSubscribed);


      if(typeof(super_admin)==='string'){
        const isSuperAdmin=(super_admin==="true");
        setSuperAdmin(isSuperAdmin);
      }
      else{
        console.log(super_admin);
        setSuperAdmin(super_admin);
      }

      console.log(isLoggedIn, isAdmin,superAdmin, isSubscribed);
      const tokenExpirationDate= expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
  console.log("storing in local storage",superAdmin);
      localStorage.setItem(
      'userData',
      JSON.stringify({
      userId: uid,
      token: token,
      expiration: tokenExpirationDate.toISOString(),
      userType: userType,
      superAdmin: superAdmin,
      isSubscribed: isSubscribed
      }));
    },[]);

    const logout=useCallback(()=>{
    console.log("hook logout ");
        setToken(null);
        setIsLoggedIn(false);
        setIsSubscribed(false);
        setIsAdmin(false);
        setSuperAdmin(false);
        setTokenExpirationDate(null);
        setUserId(null);

        localStorage.removeItem('userData');
        localStorage.removeItem('cartId');
        localStorage.removeItem('orders');
        localStorage.removeItem('Wishlist');
        localStorage.removeItem('Notifications');
        localStorage.removeItem('avatar');
        localStorage.removeItem('products');

    },[]);

    useEffect(()=>{                                                                             //auto logout
        if(token && tokenExpirationDate){
            const remainingTime = tokenExpirationDate.getTime()-new Date().getTime();
            //console.log("remaining time ",remainingTime);
            logoutTimer=setTimeout(logout,remainingTime);
        }else{
            clearTimeout(logoutTimer);
        }
    },[token, tokenExpirationDate, logout]);

    useEffect(()=>{
    console.log("auto-login");
    const storedData=JSON.parse(localStorage.getItem('userData'));
    console.log("page refresh");
        if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
            /*const isSuperAdmin = typeof storedData.superAdmin === 'boolean'
            ? storedData.superAdmin
            : storedData.superAdmin === "true";
            console.log(isSuperAdmin);*/
            login(storedData.userId, storedData.token, new Date(storedData.expiration),storedData.userType, storedData.superAdmin, storedData.isSubscribed);
        }
    },[login]);



    return {token, login, logout, userId, isLoggedIn, isAdmin,superAdmin, isSubscribed, setSubscription};
};