import {useState,useEffect,useRef,useContext} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {useNavigate, NavLink} from 'react-router-dom';
import classes from './FabricItemOrder.module.css';
import {cartActions} from '../Store/cart_slice';
import {uiActions} from '../Store/ui_slice';
import { sendCartData } from '../Store/cart_actions';
import CartPage from './Cart';
import Modal from './Modal';
import {OrderContext} from '../Context/order-context';
import {WishlistContext} from '../Context/wishlist-context';
import {AuthContext} from '../Context/auth-context';

const FabricItemOrder=(props)=>{
    const [quantity,setQuantity]=useState(0);
    const navigate=useNavigate();
    const {createOrder, status, item,orders}=useContext(OrderContext);
    const authCtx=useContext(AuthContext);
    const {id,category,sub_category, type, desc, details, rate,image,created_by}=props.item;
    const dispatch=useDispatch();
    const cart=useSelector((state)=>state.cart);
    const showCart=useSelector((state)=>state.ui.cartIsVisible);
    dispatch(uiActions.clearNotification());
    const modal=useRef();
    const [stock,setStock]= useState(0);
    const [stockMsg, setStockMsg]= useState(null);
    const wishlistCtx=useContext(WishlistContext);
    const {wishlist, updateWishlist}=wishlistCtx;
    //const storedOrders=[JSON.parse(localStorage.getItem('orders'))];
    //console.log(storedOrders);
    useEffect(() => {

    if(id){
        checkAvailability();
        if(stock<=2 && category!=='fabrics')
            setStockMsg(`Last ${stock} remaining`);
        if(stock<=2 && category==='fabrics')
            setStockMsg(`Only ${stock}meter(s) in stock`);
        if(stock<=0)
            setStockMsg("Out of stock");
        }
        return()=>{
                    (async()=>{
                    if(!authCtx.isLoggedIn) return;
                    const lsWishlist=JSON.parse(localStorage.getItem("Wishlist"));
                     try{
                        await fetch(
                            `http://localhost:5000/user/wishlist`,
                        {
                            method: 'PUT',
                            headers:{'content-type':'application/json'},
                            body:JSON.stringify({
                              id:authCtx.userId,
                              wishlist:lsWishlist})
                        });
                    }
                    catch(error){
                        console.log(error);
                    }
                })();
              }
      }, [stock, id,wishlist]);

    const handleChange=(e)=>{
        e.preventDefault();
        setQuantity(e.target.value);
    };

    const addToCart=(e)=>{
        e.preventDefault();
        if(stock===0){
            alert("Insufficient stock!")
            return;
        }
       if(Number(quantity)===0 || quantity.trim()===''){
            alert("Enter quantity");
            return;
       }
        // update stock and set timer
       const updateStock=async(id, quantity)=>{
       const stock_response=await fetch('http://localhost:5000/store/stock',{
                           method:'PUT',
                           headers:{'content-type':'application/json'},
                           body:JSON.stringify({id:id,quantity:quantity})
           });
           if(stock_response){
               const updatedStock=await stock_response.json();
               console.log(updatedStock.data);
           }
       }

       console.log(id,quantity);
       updateStock(id, quantity);
        dispatch(cartActions.addToCart({item:{
                                                id,
                                                type,
                                                rate,
                                                image,
                                                created_by,
                                                category,
                                                quantity:quantity}}));

        dispatch(uiActions.setCartVisibility(true));

        setTimeout(() => {
            console.log("in settimeout",quantity);
            if (!status || (status && Array.isArray(item) && item.find(itm=>itm.id===id))) {      //check if not present in order items and present in cart items
              updateStock(id, -quantity);
              dispatch(cartActions.releaseStock({id:id}));   //release stock alloted in cart after 15 mins
            }
          }, 5000); // 1 minute in milliseconds
        navigate('/Cart');
    };

    const checkAvailability=async()=>{
        const stockResp=await fetch(`http://localhost:5000/store/stock/${id}`);
        console.log(id, stockResp);
        if(stockResp){
            const {data}=await stockResp.json();
            console.log(data.stock);
            setStock(Number(data.stock));
            setStockMsg("");
            if(stock<2)
                setStockMsg("Few left");
            if(stock<=0){
                setStockMsg("Out of stock");
                return;
            }
        }
    }
    const wishlistHandler=(id)=>{

    let newWishlist=[...wishlist]
    if((wishlist.filter((item)=>item===id).length)===0) {  //add to wishlist
            newWishlist=[...wishlist,id];
    }
    else    //Remove from wishlist
    {
        newWishlist=wishlist.filter((item)=>item!==id);
    }
    localStorage.setItem("Wishlist",JSON.stringify(newWishlist));
    updateWishlist(newWishlist);
    console.log(newWishlist, wishlist);
 }


    const checkoutHandler=async(e)=>{
    e.preventDefault();
    checkAvailability();
    if(stock===0){
        setStockMsg("Out of stock!")
        return;
    }
    if(stock<Number(quantity)){
        setStockMsg("Insufficient stock!")
        return;
    }
    if(Number(quantity)===0 || quantity.trim()===''){
     alert("Enter quantity");
     return;
    }
    const amount=rate*quantity;
    const order_item={id,type,rate,image,quantity,amount,created_by,category,sub_category,details,desc};

    try{
    //check Stock in store for order_item
    checkAvailability();

    if(!authCtx.isLoggedIn){
        navigate('/user?mode=login&order=open');
        return
    }

        const response = await fetch('http://localhost:5000/orders',{
                        method:'POST',
                        headers:{
                            'Authorization': `Bearer ${authCtx.token}`,
                            'content-type':'application/json'},
                        body:JSON.stringify({items:[order_item],totalQuantity:quantity,totalAmount:amount,client_id:authCtx.userId})
        });
        const {orderId} = await response.json();

        console.log(orderId);
        createOrder([order_item],quantity,rate*quantity,orderId);

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
  };
return(
<>
<section className={classes.section}>
    <form>
    <div className={classes.disp}>
        {stockMsg && <div className={classes.message}>{stockMsg}</div>}

    {category && category.toLowerCase()==='fabrics' && (<>
    <div>{desc}</div>
    <div><span>Price:</span><span>{rate} </span><span>Rs/meter</span></div>
    <div><span> Quantity:</span><span><input disabled={stock<=0} style={{width:'100px'}} onChange={handleChange} name="qty" type="text"  /></span><span>meter</span></div>
     <div><span style={{fontSize:'12px'}}>Minimum Order 1 meter</span></div></>)}

    {category && category.toLowerCase()!=='fabrics' && (<>
    <div>{desc}</div>
    <div><span>Price:</span><span>Rs</span><span>{rate}/- </span></div>
    <div><span> Quantity:</span><span><input disabled={stock<=0} style={{width:'100px'}} onChange={handleChange} name="qty" type="text"  /></span></div></>)}




    {Array.isArray(details) &&
     <div className={classes.details}>
        <div>Product details</div>
        <div>{details[0]}</div>
        <div>{details[1]}</div>
     </div>}

      <div className={classes.actions}>
         <button disabled={stock<=0} onClick={addToCart}>ADD TO CART</button>
         <button disabled={stock<=0} onClick={checkoutHandler}>BUY IT NOW</button>
     </div>
      <div className={classes.actions}>
      {(wishlist && (wishlist.filter((itm)=>itm===String(id))).length!==0) ?
          (<i onClick={()=>wishlistHandler(id)} style={{color:'red',verticalAlign:'middle', fontSize:'30px'}}class="fa-regular fa-heart"></i>)
        :(<i onClick={()=>wishlistHandler(id)} style={{color:'white',verticalAlign:'middle', fontSize:'30px'}}class="fa-regular fa-heart"></i>)}
      </div>
      <div className={classes.actions}>
      </div>
     </div>
    </form>
    </section>

</>
);
}

export default FabricItemOrder;
