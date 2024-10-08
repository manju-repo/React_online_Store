import React from 'react';
import classes from './FabricsList.module.css';
import {useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {uiActions} from '../Store/ui_slice';
import {NavLink, useNavigate} from 'react-router-dom';
import  '@fortawesome/fontawesome-free/css/all.css';
import {AuthContext} from '../Context/auth-context';
import {WishlistContext} from '../Context/wishlist-context';


const FabricsList=React.memo(({list, category, sub_category, updateFabricList} ) =>{
    const dispatch=useDispatch();
    const authCtx=useContext(AuthContext);
    const wishlistCtx=useContext(WishlistContext);
    const navigate=useNavigate();
    const {wishlist, updateWishlist}=wishlistCtx;
    const [showStock, setShowStock]=useState(null);
    const [size,setSize]=useState(null);
    const [maxSize,setMaxSize]=useState(null);

    const [stockValues, setStockValues] = useState({
        sizeXS: '',sizeS: '',sizeM: '',
        sizeL: '',sizeXL: '',sizeXXL: ''});

    const [stock, setStock] = useState(0);
console.log(list);


useEffect(()=>{
console.log(list);
return()=>{
            (async()=>{
            if(!authCtx.isLoggedIn) return;
            const lsWishlist=JSON.parse(localStorage.getItem("Wishlist"));
            if(!lsWishlist) return;

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
},[wishlist, authCtx.isLoggedIn, authCtx.userId, stock]);

 const wishlistHandler=(id)=>{
     //console.log(id, wishlist);

    let newWishlist=[...wishlist]
    if((wishlist.filter((item)=>item===id).length)===0) {  //add to wishlist
            newWishlist=[...wishlist,id];
    }
    else    //Remove from wishlist
    {
        newWishlist=wishlist.filter((item)=>item!==id);
    }
//        alert(newWishlist);
    localStorage.setItem("Wishlist",JSON.stringify(newWishlist));
    updateWishlist(newWishlist);
    console.log(newWishlist, wishlist);
 }

 const removeEntryHandler = (id) => {

    const deleteFabric = async(dispatch)=>{
      try{
           const response=await fetch(
                    `http://localhost:5000/fabrics/${id}`,
                    { method:'DELETE',
                      headers:{Authorization:'Bearer '+ authCtx.token}
                    }
                  );
           if(! response.ok)
                throw new Error("Could not delete the Fabric");
           const resData = await response.json();
           console.log(resData);
           updateFabricList();
           navigate('/store/'+category);
        }
        catch(error){
            console.log(error);
            }
        }
      deleteFabric(dispatch);
   }

   const addFabricHandler = () => {
   if(!authCtx.isAdmin){
        alert("You are not authorized to add items");
        return;
    }
    navigate(`/fabrics/new/${category}`);
   }

    const stockUpdateHandler=(id)=>{
    let size, maxSize
         const selectedItem = list.find((item) => item._id === id);
         try{
             size=JSON.parse(selectedItem?.size);
         }
         catch(err){
             size=selectedItem?.size;
         }
         try{
              maxSize=JSON.parse(selectedItem?.maxSize);
          }
          catch(err){
              maxSize=selectedItem?.maxSize;
          }
console.log(size, maxSize);
        setSize(size);setMaxSize(maxSize);
        console.log(selectedItem.stock);
        setStock(selectedItem.stock);
        setStockValues({
          sizeXS: size?.sizeXS || 0,
          sizeS: size?.sizeS || 0,
          sizeM: size?.sizeM || 0,
          sizeL: size?.sizeL || 0,
          sizeXL: size?.sizeXL || 0,
          sizeXXL: size?.sizeXXL || 0
        });

    setShowStock(prevId => (prevId === id ? null : id));
    }

    const cancelStockUpdate=()=>{
        setShowStock(null);
            setStockValues({
              sizeXS: '',
              sizeS: '',
              sizeM: '',
              sizeL: '',
              sizeXL: '',
              sizeXXL: ''
        });
    }

    const handleStockChange = (e) => {
        const { name, value } = e.target;
        setStockValues((prevState) => ({
          ...prevState,
          [name]: value
        }));
      }

    const handleSingleStockChange = (e) => {
        setStock(e.target.value);
      }


    const handleStockSave=async(e,id,low_stock)=>{
        e.preventDefault();
        console.log(low_stock);
        let stockValues, stock;
        if(category==='fabrics'){
            stock= e.target.stock.value;
            stockValues={sizeOne: stock};
        }
        else{
              stockValues = {
                    sizeXS: Number(e.target.sizeXS.value),
                    sizeS: Number(e.target.sizeS.value),
                    sizeM: Number(e.target.sizeM.value),
                    sizeL: Number(e.target.sizeL.value),
                    sizeXL: Number(e.target.sizeXL.value),
                    sizeXXL: Number(e.target.sizeXXL.value),
                };
             stock= (stockValues.sizeXS)+(stockValues.sizeS)+(stockValues.sizeM)+(stockValues.sizeL)+(stockValues.sizeXL)+(stockValues.sizeXXL);
        }
        // Send stockValues to backend
        console.log(stockValues, stock);
        let response = await fetch(`http://localhost:5000/fabrics/adminStockUpdate/${id}`,{
                        headers:{'Content-Type':'application/json',
                                    Authorization:'Bearer '+ authCtx.token
                                },
                        method:'PUT',
                        body:JSON.stringify({size:stockValues,stock:stock}),
        });
        console.log(response);
        console.log("Stock updated for item:", id, stockValues);
        setShowStock(null);
updateFabricList();
        //checking for low_stock alert set

        if(low_stock.length>0){         //fetch users who have subscribed to stock updates
            try{
                    response = await fetch(`http://localhost:5000/subscription/checkSubscription/${id}`);
                    if(!response.ok) {
                        console.error('Failed to fetch subscription details:', response.statusText);
                        return;
                    }
                    const {subscription}=await response.json();
                    console.log(subscription);
                    const selectedItem = list.find((item) => item._id === id);
                    console.log(selectedItem.desc);
                    const notificationMsg=`Product ${selectedItem.desc} is back in stock`;
                    const imageUrl=selectedItem.image[0];
                    console.log(imageUrl);
                    console.log(authCtx.token);
                    if(subscription?.length>0){      //create notifications to be sent to the subscribed active users
                        for (const subs of subscription) {
                            response = await fetch(`http://localhost:5000/notifications`,{
                                headers:{'Content-Type':'application/json',
                                            Authorization:'Bearer '+ authCtx.token
                                        },
                                method:'POST',
                                body:JSON.stringify({isGeneral:false,userId:subs.userId,productId:id,userType:'Vendor',notificationMsg:notificationMsg, imageUrl:imageUrl}),
                            });
                        }
                    }
            }catch(error){
                console.error('Error fetching subscription details:', error);
            }
        }
      }

  return (<>
<div>

    {list.length===0 && <h2>We are currently Out of Stock</h2>}
</div>
{authCtx.isLoggedIn && authCtx.isAdmin &&
        <div style={{textAlign:'left',marginBottom:'20px'}}><button  className={classes.button} onClick={addFabricHandler}>Add Product</button></div>
}
<ul className={classes.gallery}>
  { list.map((item) => (<>

     {authCtx.isLoggedIn && authCtx.isAdmin && authCtx.userId===item.created_by && (
      <div key={item._id} className={`${classes.responsive} ${classes.item}`}>

     <li key={item._id} className={classes.item}>
        <NavLink to={{pathname:`/fabrics/${item._id}/${item.category}` }}  className={({isActive})=>isActive?classes.linkActive : classes.link}end>
            <img style={{width:'250px',height:'250px'}} src={item.image[0]} alt="Cinque Terre"/>
            <div className={classes.desc}>{item.desc}</div>
        </NavLink>
        <div><NavLink style={{textDecoration:'none',border:'none',fontSize:'12px',marginBottom:'0', color: item.low_stock?.length>0 ? 'red' : 'inherit'}}
            onClick={()=>stockUpdateHandler(item._id)}>Update Stock</NavLink>
        <i class="fa-regular fa-trash-can" onClick={()=>removeEntryHandler(item.id)}></i></div>
        {showStock===item._id && (
        <form onSubmit={(e) => handleStockSave(e, item._id, item.low_stock)} style={{ marginTop: '0', padding: '0', position: 'relative' ,border:'1px solid blue'}}>
            {category==='fabrics'?(
                <table><tr><td style={{display:'flex',fontSize:'10px',textAlign:'center'}}>
                    <input   className={`${classes.sizeBox} ${(item.low_stock?.includes('sizeOne') || item.stock<item.min_stock) ? classes.lowStock : ''}`}
                     type="text" id="stock" name="stock" value={stock}  onChange={handleSingleStockChange}/>
                </td></tr></table>
            ):(
            <table>
             <tr>
                <td style={{display:'flex',fontSize:'10px',textAlign:'center'}}>
                <span style={{height:'20px',width:'35px',minWidth:'35px',justifyContent:'top'}}>XS</span>
                <span style={{height:'20px',width:'35px',minWidth:'35px',justifyContent:'top'}}>S</span>
                <span style={{height:'20px',width:'35px',minWidth:'35px',justifyContent:'top'}}>M</span>
                <span style={{height:'20px',width:'35px',minWidth:'35px',justifyContent:'top'}}>L</span>
                <span style={{height:'20px',width:'35px',minWidth:'35px',justifyContent:'top'}}>XL</span>
                <span style={{height:'20px',width:'35px',minWidth:'35px',justifyContent:'top'}}>XXL</span></td>
             </tr>
             <tr>
                <td style={{display:'flex',justifyContent:'top',textAlign:'center'}}>
                  <input   className={`${classes.sizeBox} ${(item.low_stock?.includes('sizeXS') || size.sizeXS<maxSize.sizeXS) ? classes.lowStock : ''}`}
                     type="text" id="sizeXS" name="sizeXS" value={stockValues.sizeXS} onChange={handleStockChange} />
                  <input   className={`${classes.sizeBox} ${(item.low_stock?.includes('sizeS') || size.sizeS<maxSize.sizeS) ? classes.lowStock : ''}`}
                    type="text" id="sizeS" name="sizeS" value={stockValues.sizeS} onChange={handleStockChange} />
                  <input   className={`${classes.sizeBox} ${(item.low_stock?.includes('sizeM') || size.sizeM<maxSize.sizeM) ? classes.lowStock : ''}`}
                    type="text" id="sizeM" name="sizeM" value={stockValues.sizeM} onChange={handleStockChange} />
                  <input   className={`${classes.sizeBox} ${(item.low_stock?.includes('sizeL') || size.sizeL<maxSize.sizeL) ? classes.lowStock : ''}`}
                    type="text" id="sizeL" name="sizeL" value={stockValues.sizeL} onChange={handleStockChange} />
                  <input   className={`${classes.sizeBox} ${(item.low_stock?.includes('sizeXL') || size.sizeXL<maxSize.sizeXL) ? classes.lowStock : ''}`}
                    type="text" id="sizeXL" name="sizeXL" value={stockValues.sizeXL} onChange={handleStockChange} />
                  <input   className={`${classes.sizeBox} ${(item.low_stock?.includes('sizeXXL') || size.sizeXXL<maxSize.sizeXXL) ? classes.lowStock : ''}`}
                    type="text" id="sizeXXL" name="sizeXXL" value={stockValues.sizeXXL} onChange={handleStockChange} />
                </td>
             </tr>
             </table>
             )}
             <div style={{ position: 'absolute', right: '0', top: '0', display: 'flex', gap: '5px' }}>
                 <button type="submit" style={{height:'20px', width:'20px', color:'green', fontSize: '12px', padding: '2px', cursor: 'pointer' }}>✔</button>
                 <button
                     type="button"
                     onClick={() => cancelStockUpdate()}
                     style={{ height:'20px', width:'20px', color:'red', fontSize: '12px', padding: '2px', cursor: 'pointer' }}
                 >
                     ✘
                 </button>
             </div>
             </form>
        )}
      </li></div>)}

    {(!authCtx.isLoggedIn || (authCtx.isLoggedIn && !authCtx.isAdmin)) && (
      <div key={item._id} className={`${classes.responsive} ${classes.item}`}>

     <li key={item._id}  className={classes.item}>
        <NavLink to={{pathname:`/fabrics/${item._id}/${item.category}` }}  className={({isActive})=>isActive?classes.linkActive : classes.link}end>
        {item.category.toLowerCase()==='fabrics' && <img style={{width:'250px',height:'250px'}} src={item.image[0]} alt="Cinque Terre"/>}
        {item.category.toLowerCase()!=='fabrics' && <img style={{width:'300px',height:'350px'}} src={item.image[0]} alt="Cinque Terre"/>}
        <div className={classes.desc}>{item.desc}</div></NavLink>
 {!sub_category && (wishlist.filter((itm)=>itm===item._id)).length===0 &&
        (<div className={classes.overlay}>  <div className={classes.circle}>
            <i onClick={()=>wishlistHandler(item._id)} style={{color:'white',verticalAlign:'middle'}}class="fa-regular fa-heart"></i></div></div>)}
 {!sub_category && (wishlist.filter((itm)=>itm===item._id)).length!==0 &&
         (<div className={classes.overlay}>  <div className={classes.circle}>
             <i onClick={()=>wishlistHandler(item._id)} style={{color:'red',verticalAlign:'middle'}}class="fa-regular fa-heart"></i></div></div>)}
      </li></div>)}
 </>))}

</ul>
</>
);
});
export default FabricsList;
