import {useContext, useState} from 'react';
import classes from './Drawer.module.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../Context/auth-context';

const Drawer = ({ isOpen, onClose }) => {
const {isAdmin,superAdmin,logout}=useContext(AuthContext);
console.log(superAdmin);
    const navigate=useNavigate();
  const [isAccSetting, setAccSetting] = useState(false);

const logOut=()=>{
    logout();
    onClose();
    navigate('/homepage');
}

 const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(); // Close the drawer if the backdrop itself is clicked
        }
    }
  return (<>
  {isOpen && <div className={classes.backdrop} onClick={handleBackdropClick}></div>}
    <div className={`${classes.drawer} ${isOpen ? classes.open : ''}`}>
    {isAdmin?
        superAdmin?(
        <div className={classes.drawerContent}>
         <button onClick={onClose} className={classes.closeButton}>X</button>
         <nav>
           <ul>
             <li>
               <NavLink to="/userProfile" activeClassName={classes.active}>Profile Settings</NavLink>
             </li>
             <li>
                <NavLink to="/vendors" activeClassName={classes.active}>Vendors</NavLink>
              </li>
             <li>
               <NavLink to="/fabrics/new/fabrics" activeClassName={classes.active}>Products</NavLink>
             </li>
             <li>
                <NavLink to="/tickets" activeClassName={classes.active}>Support Tickets</NavLink>
              </li>
             <li>
               <NavLink to="/bestsellers" activeClassName={classes.active}>Best Sellers</NavLink>
             </li>
             <li>
                <NavLink to="/notifications" activeClassName={classes.active}>Notifications</NavLink>
              </li>
             <li>
                <NavLink to="/faq" activeClassName={classes.active}>FAQs</NavLink>
              </li>


             <li>
               <button onClick={logOut} className={classes.logoutButton}>Logout</button>
             </li>
           </ul>
         </nav>
       </div>
     ):
    (
     <div className={classes.drawerContent}>
             <button onClick={onClose} className={classes.closeButton}>X</button>
             <nav>
               <ul>
                 <li>
                   <NavLink to="/userProfile" activeClassName={classes.active}>Profile Settings</NavLink>
                 </li>
                 <li>
                   <NavLink to="/fabrics/new/fabrics" activeClassName={classes.active}>My Products</NavLink>
                 </li>
                 <li>
                    <NavLink to="/tickets" activeClassName={classes.active}>Support Tickets</NavLink>
                  </li>
                 <li>
                   <NavLink to="/bestsellers" activeClassName={classes.active}>Best Sellers</NavLink>
                 </li>
                <li>
                    <NavLink to="/notifications" activeClassName={classes.active}>Notifications</NavLink>
                 </li>
                 <li>
                    <NavLink to="/faq" activeClassName={classes.active}>FAQs</NavLink>
                  </li>


                 <li>
                   <button onClick={logOut} className={classes.logoutButton}>Logout</button>
                 </li>
               </ul>
             </nav>
           </div>
       ):
       (
       <div className={classes.drawerContent}>
            <button onClick={onClose} className={classes.closeButton}>X</button>
            <nav>
              <ul>
                <li>
                  <NavLink to="/userProfile" activeClassName={classes.active}>Profile</NavLink>
                </li>
                <li>
                    <button onClick={() => setAccSetting(!isAccSetting)} className={classes.subMenuButton}>
                      Account {isAccSetting ? (<span><i class="fa-solid fa-chevron-up"></i></span>):  (<span><i class="fa-solid fa-chevron-down"></i></span>)}
                    </button>
                    {isAccSetting && (
                      <ul className={classes.subMenu}>
                        <li>
                          <NavLink to="/fabrics/new/fabrics" activeClassName={classes.active}>Change Password</NavLink>
                        </li>
                        <li>
                          <NavLink to="/subscribe" activeClassName={classes.active}>Subscribe for Notifications</NavLink>
                        </li>
                      </ul>
                    )}
                </li>
                <li>
                  <NavLink to="/clientOrders" activeClassName={classes.active}>My Orders</NavLink>
                </li>

                <li>
                  <NavLink to="/notifications" activeClassName={classes.active}>Notifications</NavLink>
                </li>

                <li>
                  <NavLink to="/tickets" activeClassName={classes.active}>Support Tickets</NavLink>
                </li>

                <li>
                  <button onClick={logOut} className={classes.logoutButton}>Logout</button>
                </li>
              </ul>
            </nav>
          </div>
          )}
    </div></>
  );
};

export default Drawer;
