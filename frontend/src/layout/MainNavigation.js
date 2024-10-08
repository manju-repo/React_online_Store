import {useEffect, useState, useContext} from 'react';
import {useSelector} from 'react-redux';
import { AuthContext } from '../Context/auth-context';
import { OrderContext } from '../Context/order-context';
import Drawer from '../components/Drawer';
import {WishlistContext} from '../Context/wishlist-context';
import {NotificationContext} from '../Context/notification-context';

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import {NavLink} from 'react-router-dom';
import CartButton from '../components/CartButton';

function MainNavigation() {

    const authCtx=useContext(AuthContext);
    const {wishlist, modalOpen, showModal}=useContext(WishlistContext);
    const {notifications}=useContext(NotificationContext);
    const {orders}= useContext(OrderContext);
    const cartQuantity=useSelector((state)=>state.cart.totalQuantity);
    const inputRef = useRef();
    const navigate=useNavigate();
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    useEffect(()=>{
    console.log(notifications);
    },[authCtx.isLoggedIn, wishlist, orders, cartQuantity,authCtx.Avatar,showModal,notifications]);

    const toggleDrawer = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  const handleSearch=(e)=>{
    e.preventDefault();
    const query = inputRef.current.value; // Get the value from the input field
    //console.log(query);
    navigate(`/searchItems?query=${query}`);
  }

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
          handleSearch(e);
      }
  };
const wishlistHandler = (event) => {
    event.preventDefault(); // Prevent default navigation
    // Your custom handler logic here
    console.log('Handler executed');
            modalOpen(true);
    console.log(showModal);
    // Optionally, navigate if needed
    navigate('/wishlist');
  };
  return (
    <header className={classes.header}>
      <ul className={classes.nav}>
      <li>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                  <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <i style={{ color: '#e44da5', marginRight: '8px' }} className="fa-solid fa-magnifying-glass"></i>
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    onKeyPress={handleKeyPress}
                    style={{
                      height: '30px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      padding: '0 8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </form>
      </li>
      <li>
            <NavLink to="/homepage" ><h1 className={classes.logo}>Taarak</h1></NavLink>
      </li>
       <li>

            {/*authCtx.isLoggedIn &&  (
            <NavLink onClick={authCtx.logout} >
            <i  style={{color:'#e44da5'}} class="fa-solid fa-user"></i>
            </NavLink>
            )*/}
<ul  className={classes.right}>
            <li style={{width:'50px',height:'100%',justifyContent:'center'}}>
                {!authCtx.isSubscribed ? (
                <NavLink to={`/subscribe`} ><i style={{color:'#e44da5'}}  class="fa-regular fa-bell"></i></NavLink>
                ):(
                authCtx.isSubscribed.pushSubscribed && notifications.length>0?
                (<NavLink to={`/notifications`} ><i style={{color:'#e44da5'}}  class="fa-solid fa-bell"></i></NavLink>):
                (<NavLink to={`/notifications`} ><i style={{color:'#e44da5'}}  class="fa-regular fa-bell"></i></NavLink>))}
                {notifications.length>0 && (
                <i className={classes.badge}  style={{ position: "absolute", top: "45px", right: "320px",  fontSize:"0.75rem" }}>{notifications.length}</i>)}
            </li>

            { !(authCtx.isLoggedIn && authCtx.isAdmin) && (
            <li style={{width:'50px',height:'100%',justifyContent:'center'}}>
            <NavLink onClick={wishlistHandler} style={{ position: "relative",justifyContent:'bottom'}} >
            {wishlist.length>0?
            (<i  style={{color:'#e44da5',justifyContent:'bottom'}} class="fa-solid fa-heart"></i>):
            (<i  style={{color:'#e44da5',justifyContent:'bottom'}} class="fa-regular fa-heart"></i>)}
            {wishlist.length>0 && (
            <i className={classes.badge}  style={{ position: "absolute", top: "-25px", right: "-2px",  fontSize:"0.75rem" }}>{wishlist.length}</i>)}
            </NavLink></li>
            )}

            { !(authCtx.isLoggedIn && authCtx.isAdmin) &&
            <li style={{width:'50px',height:'100%',justifyContent:'center'}}><CartButton/></li>}


            {/*authCtx.isLoggedIn && authCtx.isAdmin && (<button style={{}} onClick={toggleDrawer} className={classes.settingsButton}>
            <i  style={{color:'#e44da5'}}  class="fa-solid fa-gear"></i></button>)}

            {authCtx.isLoggedIn && (
            <NavLink to="/clientOrders" >
                <i style={{color:'#e44da5'}} class="fa-solid fa-bag-shopping"></i>
                <i className={classes.badge}  style={{ position: "absolute", top: "15px", right: "150px",  fontSize:"0.75rem" }}>{orders.length}</i>
            </NavLink>)*/}
            {!authCtx.isLoggedIn && (<li style={{width:'50px',height:'100%',justifyContent:'center'}}><NavLink to={`/user?mode=login`} ><i style={{color:'#e44da5'}} class="fa-regular fa-user"></i></NavLink></li>)}

            {authCtx.isLoggedIn && (<>
                <li style={{width:'50px',height:'100%',justifyContent:'center'}} className={classes.avatarContainer}>
                <NavLink onClick={authCtx.logout}>
                    <i style={{ color: '#e44da5' }} className="fa-solid fa-user"></i>
                  </NavLink></li>
                  <li style={{width:'50px',height:'100%',justifyContent:'center'}}>
                  {typeof authCtx.Avatar === 'string' && authCtx.Avatar.startsWith('http') ? (
                  <img
                    src={authCtx.Avatar}
                    alt="User Avatar"
                    className={classes.avatar}
                    onClick={toggleDrawer} />
                  ):(
                  <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#e44da5', // or any background color you prefer
                          borderRadius: '50%',
                          fontSize: '20px', // adjust size as needed
                          color: 'white', // or any text color you prefer
                          border: '2px solid #e44da5'
                        }}
                        onClick={toggleDrawer}
                      >
                        {authCtx.Avatar}
                      </div>
                    )}
                </li></>
              )
            }</ul>
      </li>
    </ul>
    <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </header>
  );
}

export default MainNavigation;
