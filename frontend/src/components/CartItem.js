import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classes from './CartItem.module.css';
import { cartActions } from '../Store/cart_slice';

const CartItem = (props) => {
  const dispatch = useDispatch();
    const navigate=useNavigate();
  const {id, type, rate, quantity, totalPrice } = props.item;
  const removeItemHandler = () => {
console.log(id,type,rate,quantity);
    dispatch(cartActions.removeFromCart(id));
    navigate('/Cart');
  };

  const addItemHandler = () => {
  console.log(id,type,rate,quantity);

    dispatch(
      cartActions.addToCart({item:{
        id,
        type,
        rate,
        quantity:0.5 }})
    );
  };

  return (
    <li  className={classes.item}>
      <header>
        <h3>{type}</h3>
        <div className={classes.price}>
          Rs.{totalPrice}
          <span className={classes.itemprice}>(Rs.{rate}/meter)</span>
        </div>
      </header>
      <div className={classes.details}>
        <div className={classes.quantity}>
          x <span>{quantity}</span>
        </div>
        <div className={classes.actions}>
          <button onClick={removeItemHandler}>-</button>
          <button onClick={addItemHandler}>+</button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
