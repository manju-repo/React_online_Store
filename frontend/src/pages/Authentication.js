import {useState} from 'react';
import AuthForm from '../components/AuthForm';
import {json, redirect, useParams, useNavigate} from'react-router-dom';
import {AuthContext} from '../Context/auth-context';
import {useContext, useEffect} from'react';
import Notification from '../components/notification';


const AuthenticationPage=()=>{
const authCtx=useContext(AuthContext);
const navigate= useNavigate();
const [errors, setErrors]=useState();
if(authCtx.isLoggedIn) window.history.back();
let mode='login';
let order='';
        const searchParams = new URL(window.location.href).searchParams;
         mode = searchParams.get('mode') ;
         order = searchParams.get('order') ;
         console.log(order);
         if (!(mode === 'login' || mode === 'signup' || mode==='logout')) {
             setErrors('Invalid login mode');
             return;
          }

        //redirect('/');




    const getData=async(formData)=>{

     if (mode==='signup' && (formData.password !== formData['confirm_password']))
                 setErrors(['Password and Confirm Password not matching']);

        //throw json({ message: 'Password and Confirm Password not matching' }, { status: 422 });

     const authData={
        email: formData.email,
        password: formData.password,
     };

     authData.user_type=formData.user_type;
     console.log(authData);

     if(mode==='signup'){
        authData.name= formData.first_name + " " + formData.last_name;
        authData.phone=formData.phone;

        if(authData.user_type==='admin' && (formData.account_number===formData.confirm_account_number))
            authData.bus_name=formData.bus_name;
            authData.bus_type=formData.bus_type;
            authData.bus_category=formData.bus_category;
            authData.bus_subcategory=formData.bus_subcategory;
            authData.pan=formData.pan;
            authData.gstin=formData.gstin;
            authData.address=formData.address;
            authData.account_number=formData.account_number;
            authData.account_holder_name=formData.account_holder_name;
            authData.ifsc_code=formData.ifsc_code;

     }
     //first created cart/wishlist/order and then signed up
    const cart_id=JSON.parse(localStorage.getItem('cartId'));
     if(cart_id)
        authData.cart_id= cart_id;
    else
        authData.cart_id=null;

    const wishlist=JSON.parse(localStorage.getItem('wishlist'));
     if(wishlist)
        authData.wishlist= wishlist;
    else
        authData.wishlist=null;

    const orders=JSON.parse(localStorage.getItem('orders'));
     if(orders)
        authData.orders= orders;
    else
        authData.orders=null;



    console.log(authData);
     const response= await fetch('http://localhost:5000/user/'+ mode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData)
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
       console.log("json response ",resData);
       const token=resData.token;
       const userid=resData.userId;
       const usertype=resData.user_type;
       const expiration=new Date();
       expiration.setHours(expiration.getHours()+1);
       console.log(usertype);
  //=========================
      try{
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

           if(authCtx.isAdmin && user_cart && JSON.parse(localStorage.getItem('cartId'))){
            if(user_cart != JSON.parse(localStorage.getItem('cartId'))){
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
           }
           if(user_wl && JSON.parse(localStorage.getItem('Wishlist'))){
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

           if(user_orders)
                  localStorage.setItem('orders',JSON.stringify(user_orders));

         }

       }catch(error)
       {
         console.log(error.message);
       }
 //===================
       authCtx.login(userid, token, expiration,usertype);



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


