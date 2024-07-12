import { cartActions } from './cart_slice';
import {uiActions } from './ui_slice';
import {redirect} from 'react-router-dom';

export const fetchCartData=(cart_id, user_id)=>{
//console.log(id);
    return async (dispatch)=>{
    //console.log(id);

        const fetchData=async()=>{
        //const cart_id=id;
        console.log(user_id, cart_id);
        if (cart_id){
            const response=await fetch('http://localhost:5000/cart/'+cart_id);
            console.log(response);
            if( response){
                const respdata=await response.json();
                console.log(respdata.data);
                if(! respdata.data){
                    console.log("removing cart from local storage",cart_id);
                    localStorage.removeItem('cartId');

                     await fetch(
                            `http://localhost:5000/user/cart`,
                            {
                            method: 'PUT',
                            headers:{'content-type':'application/json'},
                            body:JSON.stringify({
                              id:user_id,
                              cart_id:null})
                            })
                }
                return respdata.data;
            }
        }
        return null;
      };
        try{
            const cartData=await fetchData();

        console.log(cartData);
        if(cartData){
            dispatch(
                cartActions.replaceCart({
                items:cartData.items || [],
                totalQuantity:cartData.totalQuantity||0,
                totalAmount:cartData.totalAmount||0,
                isInitial:false
                })
             )
          }
          else{
            dispatch(
                  cartActions.replaceCart({
                  items:[],
                  totalQuantity:0,
                  totalAmount:0,
                  isInitial:false
                  })
              )
          }
        }catch(error){
            console.log(error);
            dispatch(
                cartActions.replaceCart({
                items:[],
                totalQuantity:0,
                totalAmount:0,
                isInitial:false
                })
            )
        }
    }
}

export const sendCartData=(cart)=>{
    return async(dispatch) => {
        /*dispatch(uiActions.showNotification({
            status: 'Pending',
            title: 'Sending',
            message:'Sending cart data',
        }));*/


        const sendData=async()=>{
            if(cart.changed===false) return;
        //Check if cart id exists in local storage and the same in cart table
                //const cartIdString = localStorage.getItem('cartId');
                //const cart_id = cartIdString ? JSON.parse(cartIdString) : null;
            const cart_id=JSON.parse(localStorage.getItem('cartId'));
            const response=await fetch('http://localhost:5000/cart/'+cart_id);
            if(! response){ //exists in localstorage but not in the table, so removing from localstorage
                let cart_id=null;
                localStorage.removeItem('cartId');
            }
            console.log(cart_id);
            if( cart_id ){
                console.log(cart_id);

        //Cart is already created for this user- PUT request to add/delete items to the cart

            // if all items in the cart are deleted, delete record from cart table

                if(cart.items.length===0){
                      const response=await fetch(
                        `http://localhost:5000/cart/${cart_id}`,
                        { method:'DELETE'}
                      );


                      localStorage.removeItem('cartId');
                }
                else{
                const response=await fetch(
                    'http://localhost:5000/cart/'+cart_id,
                    {
                        method: 'PUT',
                        headers:{'content-type':'application/json'},
                        body:JSON.stringify({
                          items:cart.items,
                          totalQuantity:cart.totalQuantity,
                          totalAmount:cart.totalAmount
                        })
                    }
                );
                }

            }
            else
            {
        // Cart does not exist for this user so creating it with POST request
console.log("no cart yet");
            const response=await fetch(
                'http://localhost:5000/cart',
                {
                    method: 'POST',
                    headers:{'content-type':'application/json'},
                    body:JSON.stringify({
                      items:cart.items,
                      totalQuantity:cart.totalQuantity,
                      totalAmount:cart.totalAmount
                    })
                }
            );
                if (!response){
                    throw new Error('Sending cart data failed');
                }
                cart= await response.json();
                console.log("response",cart._id);
                localStorage.setItem("cartId",JSON.stringify(cart._id));


//get user from local storage if user has already logged in and set cartId in user table

            const user=JSON.parse(localStorage.getItem('userData'))
            console.log(user);
        if(user){
            const user_id=user.userId;

            if(user_id){
                console.log("user: ",user_id);
                const response=await fetch(
                    `http://localhost:5000/user/cart/${user_id}`,
                {
                    method: 'PUT',
                    headers:{'content-type':'application/json'},
                    body:JSON.stringify({
                      cart_id:cart._id})
                })


                 if (!response){
                    throw new Error('Updating User failed');
                }

            }
          }
        }
    }
        try{
            await sendData();
            dispatch(cartActions.setChanged(false));
        }catch(error){
        console.log(cart.items, cart.changed, cart.isInitial);
        console.log(error);
            /*dispatch(
             uiActions.showNotification({
                status:'error',
                title: 'Error!',
                message: 'Could not send cart data',
            }
            ));*/
        }
    }
  }
