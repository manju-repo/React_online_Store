import classes from './mainmenu.module.css';
import {NavLink} from 'react-router-dom';

function MainMenu( props ) {
const {items}=props;

  return (
    <div >

      <ul className={classes.list}>
        {items.map((item) => (
          <li key={item.value} className={classes.item}>
           <div className={classes.itemContainer}>
<NavLink to={{pathname:`/store/${item.value}`}} className={({isActive})=>isActive?classes.active:undefined}end>
  {item.value==='fabrics' &&  <img  className={classes.itemImage} src="https://i.pinimg.com/236x/a4/b6/ad/a4b6ad2e598e865e1f4dac896292769c.jpg"/>}
  {item.value==='sarees' &&  <img className={classes.itemImage} src="https://i.pinimg.com/236x/5c/f5/3e/5cf53ed9f63d6cbbb7eb65fbd7844687.jpg"/>}
  {item.value==='lehengas' &&  <img  className={classes.itemImage} src="https://i.pinimg.com/236x/bb/37/9b/bb379b539c91dc4b4fc8e1f85a775463.jpg"/>}
  {item.value==='salwars' &&  <img className={classes.itemImage} src="https://i.pinimg.com/474x/10/3d/8d/103d8dffba668b24a1c5de10d09572c7.jpg"/>}
  {item.value==='dupattas' &&  <img className={classes.itemImage} src="https://i.pinimg.com/236x/bc/80/43/bc80437522446fa0158740e758fb7f20.jpg"/>}
  {item.value==='shrugs' &&  <img className={classes.itemImage} src="https://i.pinimg.com/236x/b4/22/ea/b422ea3d6bea9eeabb6554ef06abb3dc.jpg"/>}
<h2 className={classes.itemTitle}>{item.label}</h2>
            </NavLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainMenu;

