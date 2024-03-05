import {useState,useEffect,useRef} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import classes from './FabricItemOrder.module.css';
import {cartActions} from '../Store/cart_slice';
import {uiActions} from '../Store/ui_slice';
import { sendCartData, fetchCartData } from '../Store/cart_actions';
import CartPage from './Cart';
import Modal from './Modal';

const FabricItemOrder=(props)=>{
    const [Quantity,setQuantity]=useState(0);
    const navigate=useNavigate();
    const item=props.item;
    const dispatch=useDispatch();
    const cart=useSelector((state)=>state.cart);
    const showCart=useSelector((state)=>state.ui.cartIsVisible);
const modal=useRef();
    useEffect(()=>{
        dispatch(fetchCartData());
    },[dispatch]);

    const handleChange=(e)=>{
        e.preventDefault();
        setQuantity(e.target.value);
    };

    const addToCart=(e)=>{
        e.preventDefault();

        dispatch(
            cartActions.addToCart({item:item,quantity:Quantity})
        );

        //navigate('/Cart');
        dispatch(uiActions.toggle());
        modal.current.open();
    };

    function handleReset(){
            console.log("in reset");
    }
return(
<>
 <Modal ref={modal} onReset={handleReset}>
    <CartPage/>
 </Modal>
<section>
    <form>
    <div className={classes.disp}>
    <label>Quantity</label>
    <input onChange={handleChange} name="qty" type="text"  />
    </div>
    <div  className={classes.disp}>
        <button onClick={addToCart}>ADD TO CART</button>
        <button>BUY IT NOW</button>
    </div>
    </form>
    </section>
</>
);
}
export default FabricItemOrder;
