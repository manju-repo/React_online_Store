import React from 'react';
import {useNavigate} from 'react-router-dom';
import classes from './FabricItem.module.css';
import FabricItemOrder from './FabricItemOrder';
import FabricForm from './FabricForm';
import {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../Context/auth-context';

const FabricItem = React.memo((props) => {
const authCtx=useContext(AuthContext);
const navigate=useNavigate();
const item=props.item;
console.log( item);

const [selectedImageIndex, setSelectedImageIndex] = useState(0);
const [isZoomed, setIsZoomed] = useState(false);
const [variants,setVariants]=useState([]);

const handleImageClick = (index) => {
        setSelectedImageIndex(index);
    };

const handleZoomClick = () => {
    setIsZoomed(!isZoomed);
  };

useEffect(()=>{
    setSelectedImageIndex(0);
    //console.log(item.colour_options);
    const fetchVariants=async()=>{
        if (item.product_code?.includes('-')) {
        try{
            const prod=item.product_code.split('-');
            console.log(prod[0]);
            const varResp=await fetch(`http://localhost:5000/store/variants/${prod[0]}`);
            const {data}= await varResp.json();
            if(data)
                setVariants(data.filter((prod=>prod._id!==item._id)));
            console.log(data);
        }
        catch(error){
            console.log(error.message);
        }
        }
    }
    fetchVariants();
    //if(variants.length>0)
        console.log(variants);

},[]);
return(
<div style={{marginTop:'50px',textAlign:'left'}}>
<button
  style={{
    marginLeft: '20px',
    marginTop: '20px',
    marginBottom: '40px',
    alignItems: 'left',
    color: 'blue',
    textDecoration: 'none',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '20px'
  }}
  onClick={()=> navigate('/store/'+item.category)}>
<i class="fa-regular fa-less-than"></i></button>
 <div className={classes.disp}>
                <div className={classes.imageContainer}>
                    <div className={`${classes.mainImageContainer} ${isZoomed ? classes.zoomed : ''}`}>
                         {Array.isArray(item.image) &&
                         <img
                            src={item.image[selectedImageIndex]}
                            alt={`Fabric ${selectedImageIndex}`}
                            className={classes.mainImage}
                        />}
                        <div className={classes.magnifier} onClick={handleZoomClick}>
                           <i className="fas fa-search-plus"></i>
                        </div>
                    </div>
                    <div className={classes.imageIcons}>
                        {Array.isArray(item.image) && item.image.map((img, index) => (
                            img &&
                            <img
                                key={index}
                                src={img}
                                alt={`Fabric ${index}`}
                                className={`${classes.icon} ${index === selectedImageIndex ? classes.selected : ''}`}
                                onClick={() => handleImageClick(index)}
                            />
                        ))}
                    </div>

                </div>


        {!authCtx.isAdmin && <div style={{width:'50%',height:'100%',marginRight:'50px'}}>
        <FabricItemOrder item={{id:item._id, product_code:item.product_code, category:item.category,sub_category:item.sub_category,
        type:item.type,rate:item.price,image:item.image,desc:item.desc,details:item.details,created_by:item.created_by,stock:item.stock,
        colour:item.colour,size:item.size,variants:variants}}/></div>}

        {authCtx.isAdmin && authCtx.userId===item.created_by && <div style={{width:'50%',height:'100%'}}>
        <FabricForm mode='edit' item={{id:item._id,product_code:item.product_code,category:item.category,sub_category:item.sub_category,
        type:item.type,rate:item.price,image:item.image,desc:item.desc,details:item.details,colour:item.colour,
        size:item.size,maxSize:item.maxSize,stock:item.stock,lowStock:item.low_stock,minStock:item.min_stock}}/></div>}

    </div>

</div>
);
});
export default FabricItem;