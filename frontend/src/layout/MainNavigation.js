import {useEffect, useState, useContext} from 'react';
import { AuthContext } from '../Context/auth-context';
import { OrderContext } from '../Context/order-context';
import Drawer from '../components/Drawer';
import {WishlistContext} from '../Context/wishlist-context';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import {NavLink} from 'react-router-dom';
import CartButton from '../components/CartButton';

function MainNavigation() {

    const authCtx=useContext(AuthContext);
    const {wishlist}=useContext(WishlistContext);
    const {orders}= useContext(OrderContext);
    const inputRef = useRef();
    const navigate=useNavigate();
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    useEffect(()=>{
    //console.log(wishlist,orders);
    },[authCtx.isLoggedIn, wishlist, orders]);

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
            <NavLink to="/homepage" ><h1 className={classes.logo}>J'Adore</h1></NavLink>
      </li>
       <li className={classes.right}>
            {!authCtx.isLoggedIn && (<NavLink to={`/user?mode=login`} className={({isActive})=>isActive?classes.active:undefined}end><i style={{color:'#e44da5'}} class="fa-regular fa-user"></i></NavLink>)}
            {authCtx.isLoggedIn &&  (
            <NavLink onClick={authCtx.logout} >
            <i  style={{color:'#e44da5'}} class="fa-solid fa-user"></i>
            </NavLink>
            )}

            { !(authCtx.isLoggedIn && authCtx.isAdmin) && (
            <NavLink to="/wishlist" style={{ position: "relative"}} >
            <i  style={{color:'#e44da5'}} class="fa-solid fa-heart"></i>
            <i className={classes.badge}  style={{ position: "absolute", top: "-15px", right: "0px",  fontSize:"0.75rem" }}>{wishlist.length}</i>
            </NavLink>
            )}
             { !(authCtx.isLoggedIn && authCtx.isAdmin) && <CartButton/>}
            {authCtx.isLoggedIn && authCtx.isAdmin && (<button style={{}} onClick={toggleDrawer} className={classes.settingsButton}>
            <i  style={{color:'#e44da5'}}  class="fa-solid fa-gear"></i></button>)}
            {authCtx.isLoggedIn && (<NavLink to="/clientOrders" >
                <i style={{color:'#e44da5'}} class="fa-solid fa-bag-shopping"></i>
                <i className={classes.badge}  style={{ position: "absolute", top: "15px", right: "25px",  fontSize:"0.75rem" }}>{orders.length}</i>
            </NavLink>)}
      </li>
    </ul>
    <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </header>
  );
}

export default MainNavigation;
