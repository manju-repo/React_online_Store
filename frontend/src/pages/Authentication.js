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
        /*if(mode==='logout'){
            authCtx.logout();
        }*/
        redirect('/');




    const getData=async(formData)=>{

     if (mode==='signup' && (formData.password !== formData['confirm_password']))
                 setErrors(['Password and Confirm Password not matching']);

        //throw json({ message: 'Password and Confirm Password not matching' }, { status: 422 });

     const authData={
        email: formData.email,
        password: formData.password,
     };
console.log(authData);
     if(mode==='signup'){
        authData.firstname= formData.first_name;
        authData.lastname= formData.last_name;

     //first created cart/wishlist/order and then signed up
     const cart_id=JSON.parse(localStorage.getItem('cartId'));
     if(cart_id)
        authData.cart_id= cart_id;
    else
        authData.cart_id=null;
    }
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
           const user_orders=loggedUser.orders;

           if(user_cart && JSON.parse(localStorage.getItem('cartId'))){
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
           if(user_wl && JSON.parse(localStorage.getItem('wishlist'))){
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
         redirect('/');
         navigate(-1);
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


