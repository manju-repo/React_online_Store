import React from 'react';
import {useState,useEffect,useRef,useContext, useCallback} from 'react';
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

const FabricItemOrder=React.memo((props)=>{
    const [quantity,setQuantity]=useState(0);
    const navigate=useNavigate();
    const {createOrder, status, item,orders}=useContext(OrderContext);
    const {isLoggedIn,token,userId}=useContext(AuthContext);
    const {id,category,sub_category, type, desc, details, rate,image,created_by, variants, size,stock}=props.item;
    console.log(stock, size, variants);
    const dispatch=useDispatch();
    const cart=useSelector((state)=>state.cart);
    const showCart=useSelector((state)=>state.ui.cartIsVisible);
    //dispatch(uiActions.clearNotification());
   // const modal=useRef();
    const [stockMsg, setStockMsg]= useState(null);
    const [selectedSize, setSelectedSize]= useState(null);
    //const [sizeOutofStock, setSizeOutofStock] =useState([]);
    const wishlistCtx=useContext(WishlistContext);
    const {wishlist, updateWishlist}=wishlistCtx;
    //const storedOrders=[JSON.parse(localStorage.getItem('orders'))];
    //console.log(storedOrders);
    const [products, setProducts] = useState(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];   //Lazy Initialization
  return savedProducts;
});


    useEffect(() => {
console.log('in ue');
        //checkAvailability();
        if(stock<=2 && category!=='fabrics')
            setStockMsg(`Last ${stock} remaining`);
        if(stock<=2 && category==='fabrics')
            setStockMsg(`Only ${stock}meter(s) in stock`);
        if(stock<=0)
            setStockMsg("Out of stock");


        /*return()=>{
        console.log('in ue return');

                    (async()=>{
                    if(!authCtx.isLoggedIn) return;
                    const lsWishlist=JSON.parse(localStorage.getItem("Wishlist"));
                    console.log("ws
                     ",lsWishlist);
                    if(!lsWishlist) return;
                     try{
                        await fetch(
                            `http://localhost:5000/user/wishlist`,
                        {
                            method: 'PUT',
                            headers:{'content-type':'application/json',
                                    },
                            body:JSON.stringify({
                              id:authCtx.userId,
                              wishlist:lsWishlist})
                        });
                    }
                    catch(error){
                        console.log(error);
                    }
                })();
              }*/
      }, [id,stock,products]);

    const handleChange=(e)=>{
        e.preventDefault();
        setQuantity(e.target.value);
    };

    const addToCart=(e)=>{
        e.preventDefault();
       if(category.toLowerCase()==='fabrics')
            setSelectedSize('sizeOne');
        console.log(selectedSize, stock, quantity);

        const setLowStock=async()=>{
            //alert(`${selectedSize}`);
            const stock_response=await fetch('http://localhost:5000/store/lowStockAlert',{
                          method:'PUT',
                          headers:{'content-type':'application/json'},
                          body:JSON.stringify({id:id,size:selectedSize})
            });

        }
         if(Number(quantity)<1 || quantity.trim()===''){
            alert("Enter quantity");
            return;
         }



        if(category.toLowerCase()!=='fabrics'){
            if (!Number.isInteger(Number(quantity))) {
                   alert("Quantity must be a whole number.");
                   return;
            }
            if(!selectedSize){
                    alert("Select Size");
                    return;
            }
            if(size[`${selectedSize}`]<quantity){
                alert(`Insufficient stock! Only ${size[`${selectedSize}`]} pc(s) available `);
                const confirm=window.confirm('do you wish to be notified when available?');
                if(confirm)
                    notifyHandler();
                setLowStock();
                return;
            }
        }
        else if(stock<quantity){
            alert(`Insufficient stock! Only ${stock} meter(s) available`);
            const confirm=window.confirm('do you wish to be notified when available?');
                if(confirm)
                    notifyHandler();
            setLowStock();
            return;
        }



        // update stock and set timer
       const updateStock=async(id, quantity)=>{

       const stock_response=await fetch('http://localhost:5000/store/stock',{
                           method:'PUT',
                           headers:{'content-type':'application/json'},
                           body:JSON.stringify({id:id,quantity:quantity,size:selectedSize})
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
                                                sub_category,
                                                desc,
                                                details,
                                                size:selectedSize,
                                                quantity:quantity}}));

        dispatch(uiActions.setCartVisibility(true));

        setTimeout(() => {
           // console.log("in settimeout",quantity);
            if (!status || (status && Array.isArray(item) && item.find(itm=>itm.id===id))) {      //check if not present in order items and present in cart items
              updateStock(id, -quantity);
              dispatch(cartActions.releaseStock({id:id}));   //release stock alloted in cart after 15 mins
            }
          }, 60000); // 1 minute in milliseconds
        navigate('/Cart');
                //dispatch(uiActions.setCartVisibility(true));

    };

    const notifyHandler=async()=>{
        console.log("in notify");

    //const productId=id;
        if(!isLoggedIn) {
            alert("Login to receive notifications");
             return;
        }


        let newProducts = [...products];
        let notify=true;

        const productIdStr = id;
        console.log("Checking if newProducts includes productId:", newProducts.includes(productIdStr));

        if (products.includes(productIdStr)){
        console.log("prod there");
            notify=false;
            newProducts = newProducts.filter(prodId => prodId !== productIdStr);
        }else {
            newProducts.push(productIdStr); // Add the product if it's not in the array
            console.log("Product added. Updated products array:", newProducts);
        }
            console.log("np",newProducts);
        try{
             const response = await fetch(`http://localhost:5000/subscription/notifyMe/${id}`, {
              method: 'POST',
              headers:{
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer '+ token
              },
              body:JSON.stringify({notify:notify, notificationType:'Stock update'})
            });
            console.log("response",response);
            if (!response.ok) {
            console.log("error");
              throw new Error('Something went wrong');
            }
            //localStorage.removeItem('products');
            console.log(newProducts);
            localStorage.setItem("products",JSON.stringify(newProducts));
            setProducts(newProducts);
            console.log('new products list',newProducts);
            //setProducts(newProducts);
            //alert(`Product notification ${notify ? 'enabled' : 'disabled'} for productId: ${productIdStr}`);
        }catch(error){
            console.log("Could not notify",error);
        }
    };

    /*const checkAvailability=async()=>{
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
    }*/
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
    //checkAvailability();
    if(stock===0){
        setStockMsg("Out of stock!")
        return;
    }
    if(stock<Number(quantity)){
        setStockMsg("Insufficient stock!")
        return;
    }
    if(Number(quantity)<1 || quantity.trim()===''){
        alert("Enter quantity");
        return;
    }
    if(category.toLowerCase()!=='fabrics'){
        if (!Number.isInteger(Number(quantity))) {
            alert("Quantity must be a whole number.");
            return;
        }
    }

    const amount=rate*quantity;
    const order_item={id,item_status:'created',type,rate,image,quantity,amount,created_by,category,sub_category,details,desc,size};

    try{
    //check Stock in store for order_item
    //checkAvailability();

    if(!isLoggedIn){
        navigate('/user?mode=login&order=open');
        return
    }

        const response = await fetch('http://localhost:5000/orders',{
                        method:'POST',
                        headers:{
                            'Authorization': `Bearer ${token}`,
                            'content-type':'application/json'},
                        body:JSON.stringify({items:[order_item],totalQuantity:quantity,totalAmount:amount,client_id:userId})
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
<section className={classes.section} style={{marginTop:'20px',alignItems:'left'}}>
    <form>
    <div className={classes.disp}>
        {stockMsg && <div className={classes.message}>{stockMsg}
        {(isLoggedIn && stock===0 && products && !products.includes(id)) &&
         (<span><button type="button" className={classes.notifyMessage} onClick={notifyHandler}>
        Notify me when available</button></span>)}
        {(isLoggedIn && stock===0 && products && products.includes(id)) &&
        (<span><button type="button" className={classes.notifyMessage} onClick={notifyHandler}>Undo Notify me</button></span>)}
    </div>}

    <div style={{textAlign:'right',width:'100%'}}>
      {(wishlist && (wishlist.filter((itm)=>itm===String(id))).length!==0) ?
          (<i onClick={()=>wishlistHandler(id)} style={{color:'red',verticalAlign:'middle', fontSize:'30px'}}class="fa-regular fa-heart"></i>)
        :(<i onClick={()=>wishlistHandler(id)} style={{color:'grey',verticalAlign:'middle', fontSize:'30px'}}class="fa-regular fa-heart"></i>)}
      </div>
    {category && category.toLowerCase()==='fabrics' && (<>
    <div>{desc}</div>
    <div><span style={{color:'black'}}>Price:</span><span>{rate} </span><span style={{color:'black'}}>Rs/meter</span></div>
    <div><span style={{color:'black'}}> Quantity:</span><span style={{color:'black'}}><input disabled={stock<=0} style={{width:'100px'}} onChange={handleChange} name="qty" type="text"  /></span><span style={{color:'black'}}>meter</span></div>
    <div><span style={{color:'black',fontSize:'12px'}}>Minimum Order 1 meter</span></div></>)}

    {category && category.toLowerCase()!=='fabrics' && (<>
    <div style={{color:'grey'}}>{desc}</div>
    <div><span  style={{color:'grey'}}>Price:</span><span style={{color:'grey'}}>Rs</span><span style={{color:'grey'}}>{rate}/- </span></div>
    <div><span style={{color:'grey'}}> Quantity:</span><span style={{color:'black'}}><input disabled={stock<=0} style={{width:'100px'}} onChange={handleChange} name="qty" type="text"  /></span></div></>)}

    {category && category.toLowerCase()!=='fabrics' && size && (<div>
        <div style={{fontSize:'10px'}}>SIZE</div>
        <div className={classes.sizeContainer}>
        <input onClick={Number(size.sizeXS) !== 0 ? ()=>setSelectedSize('sizeXS'): undefined} className={`${classes.sizeBox} ${Number(size.sizeXS)===0 ? classes.unavailable : ''} ${selectedSize === 'sizeXS' ? classes.selectedSize : ''}`}  type='text' defaultValue="XS" readOnly />
        <input onClick={Number(size.sizeS) !== 0 ? ()=>setSelectedSize('sizeS'): undefined} className={`${classes.sizeBox} ${Number(size.sizeS)===0 ? classes.unavailable : ''} ${selectedSize === 'sizeS' ? classes.selectedSize : ''}`}  type='text' defaultValue="S" readOnly />
        <input onClick={Number(size.sizeM) !== 0 ? ()=>setSelectedSize('sizeM'): undefined} className={`${classes.sizeBox} ${Number(size.sizeM)===0 ? classes.unavailable : ''} ${selectedSize === 'sizeM' ? classes.selectedSize : ''}`}  type='text' defaultValue="M" readOnly />
        <input onClick={Number(size.sizeL) !== 0 ? ()=>setSelectedSize('sizeL'): undefined} className={`${classes.sizeBox} ${Number(size.sizeL)===0 ? classes.unavailable : ''} ${selectedSize === 'sizeL' ? classes.selectedSize : ''}`}  type='text' defaultValue="L" readOnly />
        <input onClick={Number(size.sizeXL) !== 0 ? ()=>setSelectedSize('sizeXL'): undefined}className={`${classes.sizeBox} ${Number(size.sizeXL)===0 ? classes.unavailable : ''} ${selectedSize === 'sizeXL' ? classes.selectedSize : ''}`}  type='text' defaultValue="XL" readOnly />
        <input onClick={Number(size.sizeXXL) !== 0 ? ()=>setSelectedSize('sizeXXL'): undefined} className={`${classes.sizeBox} ${Number(size.sizeXXL)===0 ? classes.unavailable : ''} ${selectedSize === 'sizeXXL' ? classes.selectedSize : ''}`}  type='text' defaultValue="XXL" readOnly />
        </div>
        </div>
    )}

    {variants && variants.length>0 &&
       (<div>
           <div style={{fontSize:'10px'}}>COLOR</div>
           <div style={{display:'flex',flexDirection:'row'}}>
           {
               variants.map(variant=>(
               <NavLink to={{pathname:`/fabrics/${variant._id}/${variant.category}` }} >
               <div style={{width:'100px', textAlign:'center'}}>
               <div key={variant._id}><img style={{height:'120px',width:'80px'}} src={variant.image[0]}/></div>
               <div style={{fontSize:'12px'}}>{variant.colour}</div>
               </div>
               </NavLink>))
           }
           </div>
       </div>)
       }

    <div className={classes.actions}>
         <button style={{color:'black',fontSize:'12px'}} disabled={stock<=0} onClick={addToCart}>ADD TO CART</button>
         <button  style={{color:'black',fontSize:'12px'}}disabled={stock<=0} onClick={checkoutHandler}>BUY IT NOW</button>
     </div>



    {details && details.length>0 && (
     <div className={classes.details}>
     <div style={{color:'black'}}>Product details:</div>
     {details.map(detail=> (
        <div style={{color:'black'}}>- {detail}</div>
      ))}
     </div>
     )}



     </div>
    </form>
    </section>

</>
);
});

export default FabricItemOrder;
