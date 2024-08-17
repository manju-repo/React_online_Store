import {useEffect, useRef, useState, useContext} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import classes from './Cart.module.css';
import { sendCartData } from '../Store/cart_actions';
import {uiActions} from '../Store/ui_slice';
import Card from './card';
import CartItem from './CartItem';
import {useNavigate} from 'react-router-dom';
import Modal from './Modal';
import Notification from './notification';
import {AuthContext} from '../Context/auth-context';
import {OrderContext} from '../Context/order-context';

const CartPage=()=>{

    const dispatch=useDispatch();
    const authCtx=useContext(AuthContext);
    const{item,createOrder,status,orders}=useContext(OrderContext);
    const cart = useSelector((state) => state.cart);
    const cartItems=useSelector((state) => state.cart.items);
    const isInitial=useSelector((state) => state.cart.isInitial);
    const cartTotalItems=useSelector((state)=> state.cart.totalQuantity);
    const cartAmount=useSelector((state)=> state.cart.totalAmount);
    const showCart = useSelector((state) => state.ui.cartIsVisible);
    const notification = useSelector((state) => state.ui.notification);
    const [stockMsg,setStockMsg] = useState(null);
    const modal=useRef();
    const navigate=useNavigate();


    useEffect(() => {

        if (cart.changed)
         {
          dispatch(sendCartData(cart));
         }
         if(!cartTotalItems)
                modal.current.close();
         return() => {
           dispatch(uiActions.clearNotification());
         }
      }, [cart,dispatch]);


     useEffect(()=>{


      cartTotalItems && showCart && modal.current.open();
      return() => {
             dispatch(uiActions.clearNotification());
              dispatch(uiActions.setCartVisibility(false));
           }
     }, [dispatch, showCart, stockMsg]);






    function handleReset(){

        dispatch(uiActions.setCartVisibility(false));
        dispatch(uiActions.clearNotification());
        modal.current.close();
        navigate('/');
     }

    const handleOrder=async()=>{
        dispatch(uiActions.setCartVisibility(false));
        modal.current.close();
//check if user has logged in
        if(!authCtx.isLoggedIn){
            navigate('/user?mode=login');
            return;
         }
        try{
//check stock of each item in cartItems
            let outOfStock=false;
            for(const cartItem of cartItems){
                console.log(cartItem.id, cartItem.alloted_stock);
                //put stock alloted to cart items back into store stock
                const stock_response=await fetch('http://localhost:5000/store/stock',{
                       method:'PUT',
                       headers:{'content-type':'application/json'},
                       body:JSON.stringify({id:cartItem.id,quantity:-cartItem.alloted_stock})
                 });

                //check if stock is available in store
                const stockResp=await fetch(`http://localhost:5000/store/stock/${cartItem.id}`);
                //console.log(cartItem.id, stockResp);
                if(stockResp){
                    const {data}=await stockResp.json();
                    console.log(data.stock);
                    if(data.stock < cartItem.quantity){
                        alert("Some items in your cart are out of stock\nPlease delete them to proceed");
                        setStockMsg("Some items in your cart are out of stock\nPlease delete them to proceed");
                        dispatch(uiActions.setCartVisibility(true));
                        navigate('/cart');
                        outOfStock=true;
                        break;
                    }
                }
            }
            if(outOfStock)
                return;
            const response = await fetch('http://localhost:5000/orders',{
                            method:'POST',
                            headers:{
                                'Authorization': `Bearer ${authCtx.token}`,
                                'content-type':'application/json'},
                            body:JSON.stringify({items:cartItems,totalQuantity:cartTotalItems,totalAmount:cartAmount,client_id:authCtx.userId})
            });
            const {orderId} = await response.json();
            console.log(orderId);
            createOrder(cartItems,cartTotalItems,cartAmount,orderId);
            orders.push(orderId);
            console.log(cartItems, item, orderId, orders);
            localStorage.setItem('orders',JSON.stringify(orders));
            navigate('/order/'+orderId);
        }
        catch(error){
               console.log(error.message);
               dispatch(
                       uiActions.showNotification({
                       status: 'error',
                       title:  'Error!',
                       message: 'Could not place Order. Please try again',
                     })
                   );
        }
    }


       return(<>
        <Modal ref={modal} onReset={handleReset} onOrder={handleOrder} >
        <h2>My Cart</h2>
       {stockMsg && <div>{stockMsg}</div> }
        <div className={classes.cartItemsContainer}>
        <ul>
            {cartItems.map((item)=>(
                item.quantity>0 &&
                <CartItem
                    key={item.id}
                   item={{
                        id:item.id,
                        type:item.type,
                        rate:item.rate,
                        image:item.image,
                        quantity:item.quantity,
                        amount:item.amount,
                        category:item.category
                        }}
                />
            ))}
        </ul>
        </div>
        <div className={classes.summary}>
        <span>Total Items: {cartTotalItems}</span><span>Amount: {cartAmount}</span>
        </div>
        <div className={classes.actions} >
        <button className={classes.button} onClick={handleReset}>Continue Shopping</button>
        <button className={classes.button} onClick={handleOrder}>Order Now</button>
        </div>
        </Modal>
    { !cartTotalItems &&
         (<div className={classes.shop} >
         <button style={{borderRadius:'20px',color:'black'}} onClick={handleReset}>Start Shopping</button>
         <img style={{height:'100px',width:'100px',borderRadius:'20px'}} src="https://i.pinimg.com/236x/f9/31/39/f931398e98f3566c894b675a1b51c602.jpg"/>
         </div>)
    }
</>
);

  }


    export default CartPage;