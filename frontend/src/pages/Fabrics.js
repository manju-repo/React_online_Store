import { useEffect, useState } from 'react';
import axios from "axios";
import {useParams} from 'react-router-dom';
import FabricsList from '../components/FabricsList';

function FabricsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [Fabrics, setFabrics] = useState();
  const [error, setError] = useState();
  let {cat}=useParams();
console.log("cat="+cat);
let linkTo="fabrics";
  if(cat===2)
    linkTo="sarees";
  else if(cat===3)
    linkTo="lenhengas";

  useEffect(() => {
    axios.get(`http://localhost:5000/${linkTo}`)
              .then(response => setFabrics(response.data))
              .catch(error => console.error(error));
    }, [linkTo]);
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
      {! Fabrics && <p>No data</p>}
      {!isLoading && Fabrics && <FabricsList events={Fabrics} />}
    </>
  );
}

export default FabricsPage;