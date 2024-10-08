import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import  classes from './HomePage.module.css';
import Carousel from '../components/Carousel';

function HomePage() {
  const [items, setItems] = useState(null);
  const [banners,setBanners] = useState(null);
const images = [
    'http://localhost:5000/Images/banner1.webp',
    'http://localhost:5000/Images/banner2.webp',
    'http://localhost:5000/Images/banner3.webp'
  ];

  useEffect(() => {
      const fetchBanners = async () => {
        try {
          const response = await fetch('http://localhost:5000/notifications/banners');
          if (!response.ok) {
            throw new Error('Failed to fetch banners');
          }
          const {banners} = await response.json();
          const bannerImages = banners.map((banner) => banner.imageUrl); // Extracting imageUrl from each banner object
          setBanners(bannerImages);
          console.log(bannerImages);
        } catch (error) {
          console.log(error);
        }
      };

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
    fetchBanners();
    fetchItems();
  }, []);

  return (<>
{banners && banners.length>0 && ( <div> <Carousel images={banners} /></div>)}
<div className={classes.bestSellersHeading}>Best Sellers</div>
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

  </>);
}

export default HomePage;