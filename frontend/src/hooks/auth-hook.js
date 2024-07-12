import {useState, useEffect, useCallback} from 'react';
let logoutTimer;
export const useAuth=()=>{
    const [token, setToken]= useState(null);
    const [tokenExpirationDate, setTokenExpirationDate]= useState(null);
    const [userId, setUserId]= useState(null);
    const [isLoggedIn, setIsLoggedIn]= useState(false);
    const [isAdmin, setIsAdmin]= useState(false);

    const login=useCallback((uid, token, expirationDate,userType)=> {
      setToken(token);
      setUserId(uid);
      setIsLoggedIn(true);
      setIsAdmin(userType==='admin');
      console.log(isLoggedIn, isAdmin);
      const tokenExpirationDate= expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
  console.log("storing in local storage");
      localStorage.setItem(
      'userData',
      JSON.stringify({
      userId: uid,
      token: token,
      expiration: tokenExpirationDate.toISOString(),
      userType: userType
      })
      );
    },[]);

    const logout=useCallback(()=>{
    console.log("hook logout ");
        setToken(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');
        localStorage.removeItem('cartId');
        localStorage.removeItem('orders');
        localStorage.removeItem('Wishlist');
    },[]);

    useEffect(()=>{                                                                             //auto logout
        if(token && tokenExpirationDate){
            const remainingTime = tokenExpirationDate.getTime()-new Date().getTime();
            console.log("remaining time ",remainingTime);
            logoutTimer=setTimeout(logout,remainingTime);
        }else{
            clearTimeout(logoutTimer);
        }
    },[token, tokenExpirationDate, logout]);

    useEffect(()=>{
    console.log("auto-login");
    const storedData=JSON.parse(localStorage.getItem('userData'));
    //console.log("page refresh",storedData,storedData.token, new Date(storedData.expiration) > new Date());
        if(storedData && storedData.token && new Date(storedData.expiration) > new Date())
            login(storedData.userId, storedData.token, new Date(storedData.expiration),storedData.userType);
    },[login]);



    return {token, login, logout, userId, isLoggedIn, isAdmin};
};