import {useRef, useState,useEffect, useContext} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate,NavLink } from 'react-router-dom';
import classes from './CartItem.module.css';
import { cartActions } from '../Store/cart_slice';
import  '@fortawesome/fontawesome-free/css/all.css';
import {OrderContext} from '../Context/order-context';

const CartItem = (props) => {
    const {status, item}=useContext(OrderContext);
    const inputQuantity=useRef();
    const totalPriceRef=useRef();
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const {id, type, rate, image, quantity, totalPrice, category } = props.item;
    const [changedQuantity,setChangedQuantity]=useState(quantity);
    const [changedPrice,setChangedPrice]=useState(totalPrice);
    const [stock, setStock]=useState(0);
    const [stockUpdateMsg,setStockUpdateMsg]=useState("");

     useEffect(()=>{

        const checkAvailability=async()=>{
            const stockResp=await fetch(`http://localhost:5000/store/${id}`);
            console.log(id, stockResp);
            if(stockResp){
                const {data}=await stockResp.json();
                console.log(data.stock);
                setStock(Number(data.stock));
                setStockUpdateMsg("");
                if(stock<2)
                    setStockUpdateMsg("Few left");
                if(quantity > stock)
                    setStockUpdateMsg(`Only ${stock} piece(s) of ${type} available`);
                if(stock<=0){
                    setStockUpdateMsg("Out of stock");
                    return;
                }
            }
        }
        checkAvailability();
        setChangedQuantity(quantity);
        setChangedPrice(totalPrice);
        inputQuantity.current.value=changedQuantity;
        totalPriceRef.current.value=changedPrice;
    },[changedQuantity,stock]);

   const updateStock=async(id, quantity)=>{
   const stock_response=await fetch('http://localhost:5000/store',{
                       method:'PUT',
                       headers:{'content-type':'application/json'},
                       body:JSON.stringify({id:id,quantity:quantity})
       });
       if(stock_response){
           const updatedStock=await stock_response.json();
           console.log(updatedStock.data);
       }
   }

  const changeQuantity=(e)=>{
        console.log(stock);
      if(stock < Number(inputQuantity.current.value)){
          if(stock===0)
            setStockUpdateMsg(`Out of stock`);
          else
            setStockUpdateMsg(`${stock} pcs available`);
            inputQuantity.current.value=quantity;
            return;
      }

      if (Number(inputQuantity.current.value) === Number(quantity)) return;
      const numberAdded=Number(inputQuantity.current.value) - Number(quantity);
      if(inputQuantity.current.value<1) {
            alert("Quantity has to be minimum 1 meter");
            console.log(changedQuantity, quantity)
            //setChangedQuantity(quantity);
            inputQuantity.current.value=changedQuantity
            e.value=changedQuantity;
            return;
        }
        setChangedQuantity(inputQuantity.current.value)
        e.value=inputQuantity.current.value;
        setChangedPrice(inputQuantity.current.value*rate);
        alert(numberAdded);
        updateStock(id,numberAdded);
        dispatch(cartActions.addToCart({item:{
                                             id,
                                             type,
                                             rate,
                                             image,
                                             category,
                                             quantity:(inputQuantity.current.value)}}));
        setTimeout(() => {
            console.log("in settimeout",numberAdded);
            if (!status || (status && Array.isArray(item) && item.find(itm=>itm.id===id))) {      //check if not present in order items and present in cart items
              updateStock(id, -numberAdded);
              dispatch(cartActions.releaseStock({id:id}));   //release stock alloted in cart after 15 mins
            }
          }, 5000);
      }

  const removeEntryHandler = () => {
       if(stock===0)            //user removes item because it is not available
            inputQuantity.current.value=0;
      else{
        inputQuantity.current.value=inputQuantity.current.value-1;
        updateStock(id,-1);
      }
      dispatch(cartActions.removeFromCart({item:{id,quantity:(inputQuantity.current.value)}}));
   }


  return (
    <li  className={classes.item} key={id}>
        <div className={classes.itemdet}>
            <div>
             <NavLink to={{pathname:`/fabrics/${id}/${category}` }}  className={({isActive})=>isActive?classes.active:undefined}end>
                <img src={image}/>
            </NavLink>
            </div>
            <div>
                 <span className={classes.itemtype}>{type}</span>
                 {category.toLowerCase()==='fabrics' &&  <div className={classes.itemprice}>(Rs.{rate}/meter)</div>}
                 {category.toLowerCase()!=='fabrics' &&  <div className={classes.itemprice}>(Rs.{rate})</div>}
            </div>

            <div className={classes.quantity}>
                  x <span><input disabled={stock<=0} style={{width:'50px'}} type="text" id="qty" required onBlur={changeQuantity} ref={inputQuantity} /></span>
                {category.toLowerCase()==='fabrics' && <span style={{fontWeight:'normal',fontSize:'1rem',fontStyle:'italic'}}>meters</span>}
            </div>
            <div ref ={totalPriceRef} id="tot" className={classes.itemprice}>
                  Rs.{totalPrice}
            </div>
            <div><i className="fa-regular fa-trash-can" onClick={removeEntryHandler}></i></div>
            {stockUpdateMsg && <div className={classes.itemstock}>{stockUpdateMsg}</div>}

        </div>


    </li>
  );
};

export default CartItem;
