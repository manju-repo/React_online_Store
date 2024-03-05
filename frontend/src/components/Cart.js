import {useEffect} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import classes from './Cart.module.css';
import { sendCartData, fetchCartData } from '../Store/cart_actions';
import Card from './card';
import CartItem from './CartItem';
import {useNavigate} from 'react-router-dom';

let isInitial = true;

const CartPage=()=>{
    const dispatch=useDispatch();
    const cart = useSelector((state) => state.cart);
    const cartItems=useSelector((state) => state.cart.items);
    const showCart = useSelector((state) => state.ui.cartIsVisible);
    const notification = useSelector((state) => state.ui.notification);
    //const modal=useRef();
    const navigate=useNavigate();

    function onCloseHandler(){
        navigate('./items');
    }
     useEffect(()=>{
          dispatch(fetchCartData(cart));
         isInitial=false;

     }, [dispatch]);


      useEffect(() => {
        if (cart.changed) {
          dispatch(sendCartData(cart));
         }
      }, [cart, dispatch]);

       return(
       <>
        <h2>My Cart</h2>
        <ul>
            {cartItems.map((item)=>(
                <CartItem
                    key={item.id}
                   item={{
                        id:item.id,
                        type:item.type,
                        rate:item.rate,
                        quantity:item.quantity,
                        totalPrice:item.totalPrice
                        }}
                />
            ))}
        </ul>

        </>
   );

    };
    export default CartPage;