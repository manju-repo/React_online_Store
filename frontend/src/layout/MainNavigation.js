import classes from './MainNavigation.module.css';
import {NavLink} from 'react-router-dom';
import CartButton from '../components/CartButton';

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className="topnav">
            <NavLink to="/items" className={({isActive})=>isActive?classes.active:undefined}end><h1>J'Adore</h1></NavLink>
      </div>
       <div className="topnav-right">
                <NavLink to="/" className={({isActive})=>isActive?classes.active:undefined}end>Sign In/Sign Up</NavLink>

               <NavLink to="/" className={({isActive})=>isActive?classes.active:undefined}end>Wishlist</NavLink>

               <NavLink className={({isActive})=>isActive?classes.active:undefined}end>Cart<CartButton/></NavLink>

      </div>
    </header>
  );
}

export default MainNavigation;
