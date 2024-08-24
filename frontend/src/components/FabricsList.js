import classes from './FabricsList.module.css';
import {useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {uiActions} from '../Store/ui_slice';
import {NavLink, useNavigate} from 'react-router-dom';
import  '@fortawesome/fontawesome-free/css/all.css';
import {AuthContext} from '../Context/auth-context';
import {WishlistContext} from '../Context/wishlist-context';


function FabricsList({list, category, sub_category, updateFabricList} ) {
    const dispatch=useDispatch();
    const authCtx=useContext(AuthContext);
    const wishlistCtx=useContext(WishlistContext);
    const navigate=useNavigate();
    const {wishlist, updateWishlist}=wishlistCtx;

 //console.log(wishlist);


useEffect(()=>{
console.log(list);
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
},[wishlist, authCtx.isLoggedIn, authCtx.userId]);

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
        <div><i class="fa-regular fa-trash-can" onClick={()=>removeEntryHandler(item.id)}></i></div>
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
}
export default FabricsList;
