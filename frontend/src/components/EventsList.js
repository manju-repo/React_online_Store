import classes from './EventsList.module.css';
import {NavLink} from 'react-router-dom';
function EventsList({ events }) {
const items= Object.keys(events).map(id => {
console.log(events[id].name);
  return { uuid: id, name:events[id].name };
});
  return (
    <div className={classes.events}>

      <ul className={classes.list}>
        {items.map((item) => (
          <li  className={classes.item}>
<NavLink to={{pathname:`/fabrics/${item.name}`}} className={({isActive})=>isActive?classes.active:undefined}end>
            <h2>{item.name}</h2>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
