import {useState} from 'react';
import AuthForm from '../components/AuthForm';
import {json, redirect, useParams, useNavigate} from'react-router-dom';
import {AuthContext} from '../Context/auth-context';
import {NotificationContext} from '../Context/notification-context';

import {useContext, useEffect} from'react';
import Notification from '../components/notification';


const AuthenticationPage=()=>{
const authCtx=useContext(AuthContext);
const notCtx=useContext(NotificationContext);
const navigate= useNavigate();
const [errors, setErrors]=useState();
const [mode, setMode] = useState(null);
    const [order, setOrder] = useState('');

    useEffect(() => {
        // Initialize `mode` and `order` based on query parameters
        const searchParams = new URLSearchParams(window.location.search);
        const currentMode = searchParams.get('mode');
        const currentOrder = searchParams.get('order');
        setMode(currentMode || 'login');
        setOrder(currentOrder || '');
        console.log(searchParams.get('mode'));
    });

    useEffect(() => {
        if (authCtx.isLoggedIn) {
            navigate('/homepage');
        }
    }, [authCtx.isLoggedIn, navigate]);

    const getData=async(formData)=>{
console.log(mode);
if(!mode) return;
     if (mode==='signup' && (formData.password !== formData['confirm_password'])){
         setErrors(['Password and Confirm Password not matching']);
         return;
     }
     let authData;
     if(mode==='signup'){
     authData = new FormData();
     authData.append('email',formData.email);
     authData.append('password',formData.password);
     authData.append('user_type',formData.user_type);
     console.log(formData,authData);
console.log(authData.get('email'),formData.password);
     if(mode==='signup'){
        authData.append('name',formData.first_name + " " + formData.last_name);
        authData.append('phone',formData.phone);
        if (formData.profileImage && formData.profileImage[0])
            authData.append('profileImage',formData.profileImage[0]);
        else{
            const initials = `${formData.first_name?.[0] || ''}${formData.last_name?.[0] || ''}`;

            authData.append('profileImage', initials || 'NO_IMAGE');
        }
console.log(authData);

        if(authData.user_type==='admin' && (formData.account_number===formData.confirm_account_number)){
            authData.append('bus_name',formData.bus_name);
            authData.append('bus_type',formData.bus_type);
            authData.append('bus_category',formData.bus_category);
            authData.append('bus_subcategory',formData.bus_subcategory);
            authData.append('pan',formData.pan);
            authData.append('gstin',formData.gstin);
        }
        // address is an array like ['Line1', 'Line2', 'City']
            const addressArray = formData.address;
            // Loop through the array and append each element separately
            addressArray.forEach((addressLine, index) => {
                authData.append(`address[${index}]`, addressLine);
            });

            authData.append('account_number',formData.account_number);
            authData.append('account_holder_name',formData.account_holder_name);
            authData.append('ifsc_code',formData.ifsc_code);
     }
     //first created cart/wishlist/order and then signed up
    const cart_id=JSON.parse(localStorage.getItem('cartId'));
    authData.append('cart_id', cart_id||null);

    const wishlist=JSON.parse(localStorage.getItem('wishlist'));
    authData.append('wishlist', wishlist||null);

    const orders=JSON.parse(localStorage.getItem('orders'));
    authData.append('orders',orders||null);
    }

   else if (mode === 'login') {
        authData = JSON.stringify({
          email: formData.email,
          password: formData.password,
          cart_id: JSON.parse(localStorage.getItem('cartId')) || null,
          wishlist: JSON.parse(localStorage.getItem('wishlist')) || null,
          orders: JSON.parse(localStorage.getItem('orders')) || null,
        });
    }

    console.log(authData);
     const response= await fetch(`http://localhost:5000/user/${mode}`, {
      method: 'POST',
      headers: mode === 'login' ? { 'Content-Type': 'application/json' } : {},  //because of profile picture in signup
      body: authData
     });



  console.log(response);


       if (!response.ok) {
       //console.log(response);
       let errorData=null;
       try{
          errorData = await response.json();
         console.error('Error:', errorData.message);
         }catch(e){
           setErrors(e.message);
         }
          setErrors(errorData.message);
          return;
         // Handle the error message (e.g., display it to the user)
        // throw json({message:errorData.message},{status:500});
     }


//for admin user sign up create razorpay account
 if(mode==='signup' && formData.user_type==='admin'){

    try{
        const acc_response= await fetch('http://localhost:5000/user/createRazorpayAccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authData)
         });
        console.log(response);
    }
    catch(err){
        console.log(err);
    }
}
     try{
       const resData= await response.json();
       //console.log("json response ",resData);
       const token=resData.token;
       const userid=resData.userId;
       const usertype=resData.user_type;
       //const superAdmin=resData.super_admin;
       const expiration=new Date();
       expiration.setHours(expiration.getHours()+1);
       console.log(usertype);
  //=========================
      try{
        let profileImage,superAdmin=null, isSubscribed=null;
         const response=await fetch(`http://localhost:5000/user/${userid}`);
          if (!response){
             throw new Error('Updating User failed');
          }
         const respData=await response.json();
         if(respData){
           const loggedUser= respData.user;
           console.log(loggedUser);
           const user_cart= loggedUser.cart_id;
           const user_wl= loggedUser.wishlist;
           profileImage= loggedUser.profileImage;
           superAdmin= loggedUser.super_admin||false;
           isSubscribed=loggedUser.notificationPreferences;
           console.log('isSubscribed ', isSubscribed?.pushSubscribed);

           if(isSubscribed?.pushSubscribed){
                let notificationResponse;
                if(usertype==='admin')
                     notificationResponse=await fetch('http://localhost:5000/notifications',{
                       method:'GET',
                       headers:{
                           'Content-Type':'application/json',
                            'Authorization':'Bearer '+ token}
                       });
                else
                     notificationResponse=await fetch('http://localhost:5000/notifications/user',{
                        method:'GET',
                        headers:{
                            'Content-Type':'application/json',
                             'Authorization':'Bearer '+ token}
                        });

                if(notificationResponse.ok){
                    const {notifications}=await notificationResponse.json();
                    console.log(notifications);
                    const newNotifications= notifications.filter((notification)=>notification.readByUser===false);
                    console.log(newNotifications);
                    if(newNotifications)
                       localStorage.setItem('Notifications',JSON.stringify(newNotifications));

                    console.log(newNotifications);
                }
             }
                const ordersResp=await fetch(`http://localhost:5000/orders/getActiveOrders/${userid}`,{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                },});

                console.log(ordersResp);
                if(!ordersResp)
                    throw new Error('Could not fetch your orders');
                const orders=await ordersResp.json();
                const user_orders=orders.data;

                console.log(user_orders);

           localStorage.setItem('avatar',(profileImage));
           console.log(JSON.stringify(profileImage));
           if(!authCtx.isAdmin && user_cart && JSON.parse(localStorage.getItem('cartId'))){
            if(user_cart !== JSON.parse(localStorage.getItem('cartId'))){
              let concan=window.confirm("Do you want to replace your previous cart with the new one?");
              if(concan){
                   //user_cart=JSON.parse(localStorage.getItem('cartId'));
                    await fetch(
                          `http://localhost:5000/user/cart`,
                      {
                          method: 'PUT',
                          headers:{'content-type':'application/json'},
                          body:JSON.stringify({
                            id:userid,
                            cart_id:JSON.parse(localStorage.getItem('cartId'))})
                      })
              }
              else
                   localStorage.setItem('cartId',JSON.stringify(user_cart));
              }
              else
                   localStorage.setItem('cartId',JSON.stringify(user_cart));
           }
           if(!authCtx.isAdmin && user_wl && JSON.parse(localStorage.getItem('Wishlist'))){
              if(user_wl !== JSON.parse(localStorage.getItem('Wishlist'))){
                  let concan=window.confirm("Do you want to replace your previous wishlist with the new one?");
                  if(concan){
                       //user_wl=JSON.parse(localStorage.getItem('wishlist'));
                       await fetch(
                              `http://localhost:5000/user/wishlist`,
                          {
                              method: 'PUT',
                              headers:{'content-type':'application/json'},
                              body:JSON.stringify({
                                id:userid,
                                wishlist:JSON.parse(localStorage.getItem('wishlist'))})
                          })
                  }
                  else
                       localStorage.setItem('wishlist',JSON.stringify(user_wl));
               }
               else
                  localStorage.setItem('wishlist',JSON.stringify(user_wl));

           }

           if(user_orders)
                  localStorage.setItem('orders',JSON.stringify(user_orders));

         }
         console.log(superAdmin, isSubscribed);
         //localStorage.setItem('superAdmin',JSON.stringify(superAdmin)|| false);
         //localStorage.setItem('isSubscribed',JSON.stringify(isSubscribed)|| null);

       authCtx.login(userid, token, expiration, usertype, superAdmin, isSubscribed);

       }catch(error)
       {
         console.log(error.message);
       }
 //===================



       //authCtx.isAdmin=(usertype==='admin');
       //console.log("admin ",usertype);
       //console.log(authCtx.isAdmin);
        if(order && order==='open')
            window.history.back();

        if(usertype==='admin'){
            navigate("/clientOrders");
        }
        else
            navigate("/homepage");
               console.log(token, userid, expiration);

        }catch(e){
           setErrors(e.message);

         }
}
return (
<>

   {errors && <Notification status='error' message={errors}/>}
  <AuthForm onSubmit={getData}/>
</>
)
}
export default AuthenticationPage;


