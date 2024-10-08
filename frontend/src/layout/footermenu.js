import classes from './footermenu.module.css';
import {NavLink} from 'react-router-dom';


const FooterMenu=()=>{

 return (
    <div className={classes.itemContainer} >

      <ul className={classes.list}>
          <li className={classes.item}><NavLink style={{textDecoration:'none',border:'none',fontWeight:'100'}}>ABOUT US</NavLink></li>
          <li className={classes.item}><NavLink style={{textDecoration:'none',border:'none',fontWeight:'100'}}>FAQs</NavLink></li>
          <li className={classes.item}><NavLink style={{textDecoration:'none',border:'none',fontWeight:'100'}}>SHIPPING</NavLink></li>
          <li className={classes.item}><NavLink style={{textDecoration:'none',border:'none',fontWeight:'100'}}>CANCELLATION & RETURNS</NavLink></li>
          <li className={classes.item}><NavLink style={{textDecoration:'none',border:'none',fontWeight:'100'}}
          to="mailto:pawsconnectapp@gmail.com">CONTACT US</NavLink></li>
      </ul>
    </div>
  );

}
export default FooterMenu;