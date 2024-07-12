import {useEffect, useRef, useContext, useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import classes from './wishlist.module.css';

import Card from './card';
import {useNavigate,NavLink} from 'react-router-dom';
import Modal from './Modal';
import Notification from './notification';

import {WishlistContext} from '../Context/wishlist-context';
import {AuthContext} from '../Context/auth-context';

const WishlistPage=()=>{

    const {wishlist, updateWishlist}=useContext(WishlistContext);
    const {userId, isLoggedIn}=useContext(AuthContext);
console.log(wishlist);
    const [wishlistItems,setWishlistItems]=useState([]);
    //const showCart = useSelector((state) => state.ui.cartIsVisible);
    const notification = useSelector((state) => state.ui.notification);
    const modal=useRef();
    const navigate=useNavigate();

     useEffect(()=>{
        const fetchWishlistItems=async()=>{
            console.log(wishlist);
            if(!wishlist) return null;
            const promises=wishlist.map(async(wishlistId)=>{
            try{
                const response=await fetch('http://localhost:5000/fabrics/'+wishlistId);
                if(! response.ok){
                    throw Error('Could not load selected fabric');
                }
                return await response.json();
            }
            catch(error){
                console.log(error);
                return null
            }
          });
               const wishlistResp = await Promise.all(promises);
               if(wishlistResp.length!==0)
                    setWishlistItems(wishlistResp.filter(item => item !== null));
               else
                    setWishlistItems([]);
        }
        if(wishlist.length>0){
            fetchWishlistItems();
            modal.current.open();
        }
         else
            navigate('/');
            return()=>{
                (async()=>{
                if(!isLoggedIn) return;
                const lsWishlist=JSON.parse(localStorage.getItem("Wishlist"));
                 try{
                    await fetch(
                        `http://localhost:5000/user/wishlist`,
                    {
                        method: 'PUT',
                        headers:{'content-type':'application/json'},
                        body:JSON.stringify({
                          id:userId,
                          wishlist:lsWishlist})
                    });
                }
                catch(error){
                    console.log(error);
                }
            })();
          }
        }, [wishlist, isLoggedIn, userId, navigate]);

    function handleReset(){
        modal.current.close();
        navigate(-1);
     }

     const removeFromWishlist=(id)=>{
        //event.preventDefault();
         let newWishlist=[...wishlist]
         newWishlist=wishlist.filter((item)=>item!==id);

         localStorage.setItem("Wishlist",JSON.stringify(newWishlist));
         updateWishlist(newWishlist);
         console.log(newWishlist, wishlist);
      }

       return(<>
        <Modal ref={modal} onReset={handleReset} >

        <h2>My Wishlist</h2>
        <div  className={classes.container}>

        <ul className={classes.gallery}>
        { wishlistItems.length && wishlistItems.map((item)=>(
            <li key={item._id} className={classes.item}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <NavLink to={{pathname:`/fabrics/${item._id}/${item.category}` }}  className={({isActive})=>isActive?classes.active:undefined}end>
                    <img style={{width:'200px',height:'300px',align:'center'}} src={item.image} alt="Cinque Terre"/>
                <div className={classes.desc}>{item.desc}</div>
                </NavLink>
                <div><i className="fa-regular fa-trash-can" onClick={()=>removeFromWishlist(item._id)}></i></div>
            </div>
            </li>
        ))}
        </ul></div>
        <div className={classes.actions}><button className={classes.button} onClick={handleReset}>Back</button></div>
        </Modal>

</>
);

 }


    export default WishlistPage;