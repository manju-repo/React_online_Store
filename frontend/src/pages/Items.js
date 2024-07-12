import { useEffect, useState, useContext } from 'react';
import {useDispatch} from'react-redux';
import ItemList from '../components/ItemList';
import {uiActions } from '../Store/ui_slice';
import {OrderContext} from '../Context/order-context';

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const dispatch= useDispatch();
  const {clearContext}=useContext(OrderContext);

  useEffect(() => {
    const fetchItems = async (dispatch) => {
      try {
        const response = await fetch('http://localhost:5000/categories');
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
     return()=>{
        dispatch(uiActions.clearNotification());
    }
     return() => {
          clearContext();
     }
  }, [dispatch]);

  return <ItemList items={items} />;
};

export default ItemPage;