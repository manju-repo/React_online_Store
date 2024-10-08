import {useDispatch,useSelector} from 'react-redux';
import {useRef, useEffect} from 'react';
import {uiActions} from '../Store/ui_slice';
import classes from './CartButton.module.css';
import Modal from './Modal';
import CartPage from './Cart';
import {useNavigate, NavLink, Link} from 'react-router-dom';

const CartButton=()=>{
      const dispatch=useDispatch();
      const cartQuantity=useSelector((state)=>state.cart.totalQuantity);
      const showCart=useSelector((state)=>state.ui.cartIsVisible);
      const modal=useRef();
      const navigate=useNavigate();

        useEffect(()=>{
        },[cartQuantity]);

      const toggleCartHandler=()=>{
         dispatch(uiActions.setCartVisibility(true));
         //navigate("/cart");
      };

      return(
      <button  className={classes.button} onClick={toggleCartHandler} style={{ position: "relative",height:'100%',width:'65px',justifyContent:'center',marginRight:'0px',margin:'0px',cellPadding:'none' }}>
      <NavLink style={{ position: "relative"}} to="/cart">
            <i  style={{color:'#e44da5',justifyContent:'bottom'}} className="fa-solid fa-cart-shopping"></i>
            {cartQuantity>0 && (<i className={classes.badge}  style={{ position: "absolute", top: "-35px", right: "-35px",  fontSize:"0.75rem" }}>{cartQuantity}</i>)}
     </NavLink>
     </button>
      );
    };

export default CartButton;