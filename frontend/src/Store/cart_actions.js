import { cartActions } from './cart_slice';
import {uiActions } from './ui_slice';

export const fetchCartData=()=>{
    return async (dispatch)=>{
        const fetchData=async()=>{
            const response=await fetch('http://localhost:5000/cart');
            if(! response.ok){
                throw new Error('could not fetch Cart');
            }
            const data=await response.json();
           //console.log("data from fetch:"+data);
 //Object.keys(data).map(id => {
//console.log(data[0].items[0].type,data[0].totalQuantity);

            return data;
        };
        try{
            const cartData=await fetchData();
       // console.log("in fetch cart--items:"+cartData[0].items[0].type+" qty:"+cartData[0].totalQuantity);
            dispatch(
                cartActions.replaceCart({
                items:cartData[0].items || [],
                totalQuantity:cartData[0].totalQuantity,
                })
            )
        }catch(error){
        dispatch(
            uiActions.showNotification({
                status: 'error',
                title:  'Error!',
                message: 'Could not fetch cart data',
                })
            );

        }

    }
}

export const sendCartData=(cart)=>{
    return async(dispatch) => {
        dispatch(uiActions.showNotification({
            status: 'Pending',
            title: 'Sending',
            message:'Sending cart data',
        }));


        const sendData=async()=>{
console.log(cart.totalQuantity);
            const response=await fetch(
                'http://localhost:5000/cart/65e013b9b179e4c91593b330',
                {
                    method: 'PUT',
                    headers:{'content-type':'application/json'},
                    body:JSON.stringify({
                      items:cart.items,
                      totalQuantity:cart.totalQuantity
                    })
                }
            );
            if (!response.ok){
                throw new Error('Sending cart data failed');
            }
            //localStorage.setItem("cart",cart.items);
            cart.changed=false;
        };

        try{
            await sendData();
            dispatch(
            uiActions.showNotification({
                status:'success',
                title: 'Success!',
                message: 'Sent cart data successfully',
            }                                                                                                                                   )
            );

        }catch(error){
            dispatch(
             uiActions.showNotification({
                status:'error',
                title: 'Error!',
                message: 'Could not send cart data',
            }
            ));
        }
    }
    }
