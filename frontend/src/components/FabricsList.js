import classes from './FabricsList.module.css';
import {NavLink} from 'react-router-dom';
function FabricsList({ events }) {
let category="We are currently Out of Stock";
const items= Object.keys(events).map(id => {
category=events[id].category+" Store";
  return { uuid: id,id:events[id].Fabid, name:events[id].sub_category, desc:events[id].desc ,details:events[id].details,image:events[id].image, colour:events[id].colour};
});
  return (

  <ul>
    <h2>{category} </h2>

      {items.map((item) => (
    <div className={classes.responsive}>
      <div className={classes.gallery}>
      <li key={item.id}>
        <NavLink to={{pathname:`/fabric/${item.id}` }}  className={({isActive})=>isActive?classes.active:undefined}end>
            <img src={item.image} alt="Cinque Terre"/>
        </NavLink>

        <div className={classes.desc}>{item.name} {item.colour}</div>
      </li>
      </div>
    </div>

  ))
}
</ul>

);
}
export default FabricsList;
