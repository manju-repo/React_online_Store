import React, { useState, useEffect } from "react";
import axios from "axios";
import {useParams,useLocation} from 'react-router-dom';
import FabricItem from '../components/FabricItem';


function FabricDetailPage(){
    const params=useParams();
    const location=useLocation();
    const  sel_item =location.state;

      const [items, setItems] = useState([]);
      useEffect(() => {
        console.log("selected item id"+sel_item.itemId);
        axios.get("http://localhost:5000/fabrics/1")
          .then(response => setItems(response.data))
          .catch(error => console.error(error));
      }, []);

  return (

    <FabricItem item={items}/>
  );
}

export default FabricDetailPage;