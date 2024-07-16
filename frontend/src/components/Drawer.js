import React from 'react';
import classes from './Drawer.module.css';
import { NavLink } from 'react-router-dom';

const Drawer = ({ isOpen, onClose }) => {
  return (
    <div className={`${classes.drawer} ${isOpen ? classes.open : ''}`}>
     <div className={classes.drawerContent}>
             <button onClick={onClose} className={classes.closeButton}>X</button>
             <nav>
               <ul>
                 <li>
                   <NavLink to="/profile" activeClassName={classes.active}>Profile</NavLink>
                 </li>
                 <li>
                   <NavLink to="/settings" activeClassName={classes.active}>Add Items</NavLink>
                 </li>
                 <li>
                   <NavLink to="/support" activeClassName={classes.active}>Support</NavLink>
                 </li>
                 <li>
                   <button onClick={onClose} className={classes.logoutButton}>Logout</button>
                 </li>
               </ul>
             </nav>
           </div>
    </div>
  );
};

export default Drawer;
