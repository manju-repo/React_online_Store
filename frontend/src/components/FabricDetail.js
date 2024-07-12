import { useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams, redirect} from 'react-router-dom';
import classes from './FabricItem.module.css';
import FabricItemOrder from './FabricItemOrder';
import FabricItem from './FabricItem';
import FabricsList from './FabricsList';
import {uiActions} from '../Store/ui_slice';

function FabricDetailPage(){
const [fabric,setFabric]=useState([]);
const [fabrics,setFabrics]=useState([]);
const dispatch=useDispatch();
const {fabricId,category}=useParams();
 useEffect(()=>{
 console.log(fabricId,category);

        const loadFabric=async(dispatch)=>{

        try{
            const response=await fetch('http://localhost:5000/fabrics/'+fabricId);
            if(! response.ok){
                throw Error('Could not load selected fabric');
            }
            const resData=await response.json();
            console.log(resData);
            setFabric(resData);
        }
        catch(error){
            console.log(error);
        }
    }
    const loadFabrics=async(dispatch)=>{
        try{
            const response=await fetch('http://localhost:5000/'+(category.toLowerCase()));
            if(! response.ok)
                throw Error('Could not load items');

            const resData=await response.json();
            if (resData) {
                setFabrics(resData.filter(fabric=>fabric._id.toLowerCase()!==fabricId.toLowerCase()));
                if (fabrics) {
                    console.log(fabrics);
                }
                //setFabrics(fabrics.filter(fabric=>fabric._id.toLowerCase()!==fabricId.toLowerCase()));
            }

        }catch(error){
          console.log(error);
        }
    }
    loadFabric();
    loadFabrics();
    //loadFabric();
     return() => {
       dispatch(uiActions.clearNotification());
     }
 },[fabricId,dispatch]);

 return(<>
 {fabric && < FabricItem item={fabric}/>}
 {fabrics && < FabricsList list={fabrics} category={category}/>}

 </>);
}

export default FabricDetailPage;
