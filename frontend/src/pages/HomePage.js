import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import  classes from './HomePage.module.css';
function HomePage() {
  const [items, setItems] = useState(null);

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
  }, []);

  return (
    <div className="container">
      <div className="gallery">
        {items &&
          items.map((item) => (
          <div className={classes.responsive} >
                <div className={classes.gallery}>
            <NavLink className={classes.item}
              key={item._id}
              to={{ pathname: `/store/${item.category}/${item.sub_category}` }}>
              <img src={item.image} alt={item.details} />
              <div  className={classes.desc}>{item.details}</div>
            </NavLink></div></div>
          ))}
      </div>
    </div>
  );
}

export default HomePage;