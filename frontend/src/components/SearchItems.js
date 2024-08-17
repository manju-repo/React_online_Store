import { useSearchParams,NavLink } from 'react-router-dom';
import {useEffect, useState} from 'react';
import classes from './SearchItems.module.css';

const SearchItems=()=>{
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [items,setItems] = useState(null);
    const [searchItems,setSearchItems] =useState([]);
    const [descriptions, setDescriptions] = useState([]);



       useEffect(() => {
           const fetchItems = async () => {
               try {
                   const response = await fetch(`http://localhost:5000/store`);
                   const { data } = await response.json();
                   setItems(data);
               } catch (error) {
                   console.log('error fetching items', error);
               }
           };
           fetchItems();
       }, []);

       useEffect(() => {
           if (items && query) {
               const keywords = query.split(/\s+/);
               const filteredItems = items.filter(item =>
                   keywords.every(keyword => item.desc.toLowerCase().includes(keyword.toLowerCase()))
               );
               setSearchItems(filteredItems);
           }
       }, [items, query]);
return(
<>
    {searchItems && searchItems.length>0 ?(
         <ul  className={classes.grid_list}>
        {searchItems.map(item => (
         <li key={item._id} className={classes.grid_item}>
         <NavLink style={{color:'blue',textDecoration:'none',border:'none'}}
            to={`/fabrics/${item._id}/${item.category}`}>
              <div ><img style={{height:'100px',width:'100px'}} src={item.image[0]}/></div>
              <div>{item.desc}</div>
         </NavLink>
         </li>))}
         </ul>
      ):
        <div style={{textAlign:'center'}}>No products found</div>
      }
</>);
}

export default SearchItems;