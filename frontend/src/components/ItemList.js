import classes from './ItemList.module.css';
import {NavLink} from 'react-router-dom';
function ItemList({ items }) {
  return (
    <div className={classes.events}>

      <ul className={classes.list}>
        {items.map((item) => (
          <li  key={item.id} className={classes.item}>
<NavLink to={{pathname:`/store/${item.category_id}`}} className={({isActive})=>isActive?classes.active:undefined}end>
            <h2>{item.name}</h2>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;

//<NavLink to={{pathname:`/fabrics/${item.name}`}} className={({isActive})=>isActive?classes.active:undefined}end>
