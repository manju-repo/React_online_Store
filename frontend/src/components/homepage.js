import classes from './ItemList.module.css';
import {NavLink} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Carousel from '../components/Carousel';
const [items,setItems]=useState(null);
const images = [
    'http://localhost:5000/Images/banner1.webp',
    'http://localhost:5000/Images/banner2.webp',
  ];
function HomePage() {

 useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/bestsellers');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const itemsData = await response.json();
        setItems(itemsData);
      } catch (error) {
        console.log(error);

      }
    };
    fetchItems();

    },[]);

  return (<>
       <div> <Carousel images={images} /></div>

  {/*  <div className={classes.events}>

      <ul className={classes.list}>
        {items.map((item) => (
          <li  key={item._id} className={classes.item}>
<NavLink to={{pathname:`/store/${item.category}`}} className={({isActive})=>isActive?classes.active:undefined}>
            <img src={item.image} />
            </NavLink>
          </li>
        ))}
      </ul>
    </div>*/}
  </>);
}

export default ItemList;

