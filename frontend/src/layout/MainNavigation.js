import {useEffect, useState, useContext} from 'react';
import { AuthContext } from '../Context/auth-context';
import { OrderContext } from '../Context/order-context';

import {WishlistContext} from '../Context/wishlist-context';

import classes from './MainNavigation.module.css';
import {NavLink} from 'react-router-dom';
import CartButton from '../components/CartButton';

function MainNavigation() {

    const authCtx=useContext(AuthContext);
    const {wishlist}=useContext(WishlistContext);
    const {orders}= useContext(OrderContext);
    useEffect(()=>{
    console.log(wishlist,orders);
    },[authCtx.isLoggedIn, wishlist, orders]);

  return (
    <header className={classes.header}>
      <ul className={classes.nav}>
      <li>
            <NavLink to="/" ><i  style={{color:'#e44da5'}} class="fa-solid fa-magnifying-glass"></i></NavLink>
      </li>
      <li>
            <NavLink to="/homepage" ><h1 className={classes.logo}>J'Adore</h1></NavLink>
      </li>
       <li className={classes.right}>
            {!authCtx.isLoggedIn && (<NavLink to={`/user?mode=login`} className={({isActive})=>isActive?classes.active:undefined}end><i class="fa-regular fa-user"></i></NavLink>)}
            {authCtx.isLoggedIn &&  (<NavLink onClick={authCtx.logout} ><i  style={{color:'#e44da5'}} class="fa-solid fa-user"></i></NavLink>)}
            <NavLink to="/wishlist" style={{ position: "relative"}} ><i  style={{color:'#e44da5'}} class="fa-solid fa-heart"></i>
            <i className={classes.badge}  style={{ position: "absolute", top: "-15px", right: "0px",  fontSize:"0.75rem" }}>{wishlist.length}</i></NavLink>
            <CartButton/>
            <NavLink to="/clientOrders" >
                <i style={{color:'#e44da5'}} class="fa-solid fa-bag-shopping"></i>
                <i className={classes.badge}  style={{ position: "absolute", top: "-15px", right: "0px",  fontSize:"0.75rem" }}>{orders.length}</i>
            </NavLink>
      </li>
    </ul>
    </header>
  );
}

export default MainNavigation;
