import { useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch} from'react-redux';
import {uiActions } from '../Store/ui_slice';
import FabricsList from '../components/FabricsList';
import {WishlistContext} from '../Context/wishlist-context';

function FabricsPage() {
  const [fabrics, setFabrics] = useState([]);
  const dispatch= useDispatch();
  const {category,sub_category} = useParams();
  console.log("cat",category);
  const {wishlist}=useContext(WishlistContext);
  let queryString="";
  if(sub_category){
    queryString=`?sub_category=${sub_category}`;
  }
  console.log("qry ",queryString);
    const fetchFabrics=async(dispatch)=>{
        try{

              const response = await fetch(`http://localhost:5000/${category}${queryString}`);
              if (!response.ok) {
                throw new Error('Fetching Fabrics failed')
              }
              const resData = await response.json();
              //console.log(resData);
              setFabrics(resData);
          }catch(error){
              /*dispatch(
                uiActions.showNotification({
                status: 'error',
                title:  'Error!',
                message: error.message,
              })
            );*/
            console.log(error.message);
           }
        }

  useEffect(() => {
        fetchFabrics();
        return()=>{
            dispatch(uiActions.clearNotification());
        }
    },[dispatch, category, sub_category]);
    return (
    <>{fabrics && <FabricsList list={fabrics} category={category} sub_category={sub_category} updateFabricList={fetchFabrics}/>}</>);
  };

    export default FabricsPage;



