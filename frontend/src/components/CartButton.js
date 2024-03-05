import {useDispatch,useSelector} from 'react-redux';
import {useRef} from 'react';
import {uiActions} from '../Store/ui_slice';
import classes from './CartButton.module.css';
import Modal from './Modal';
import CartPage from './Cart';
import {useNavigate} from 'react-router-dom';

const CartButton=()=>{
      const dispatch=useDispatch();
      const cartQuantity=useSelector((state)=>state.cart.totalQuantity);
      const showCart=useSelector((state)=>state.ui.cartIsVisible);
      const modal=useRef();
      const navigate=useNavigate();

      const toggleCartHandler=()=>{
      console.log(showCart);
          showCart ? modal.current.close() : modal.current.open();
      };

    function handleReset(){
        console.log("in reset");
         // dispatch(uiActions.toggle());
     }
     function handleOrder(){
        console.log("in Order");

     }

      return(
      <>
      <Modal ref={modal} onReset={handleReset} >
          <CartPage/>
       </Modal>
       <section>
       <button className={classes.button} onClick={toggleCartHandler}>
            <span className={classes.badge}>{cartQuantity}</span>
       </button>
       </section>
        </>
      );
    };

export default CartButton;