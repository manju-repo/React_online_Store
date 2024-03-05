import React, { useState, useEffect } from "react";
import axios from "axios";
import {useParams} from 'react-router-dom';
import classes from './FabricItem.module.css';
import FabricItemOrder from './FabricItemOrder';
import FabricItem from './FabricItem';

function FabricDetailPage(){
    const params=useParams();
    let {fabricId}=useParams();
    const [item, setItem] = useState([]);
    const [error, setError] = useState();

      useEffect(() => {
        axios.get(`http://localhost:5000/fabrics/${fabricId}`)
          .then(response => setItem(response.data))
          .catch(error => console.error(error));
      }, []);
  return (
  <>
          {error && <p>{error}</p>}
          {item && <FabricItem item={item}/>}
    </>
  );
}

export default FabricDetailPage;