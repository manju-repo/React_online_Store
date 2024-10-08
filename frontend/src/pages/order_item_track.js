import {useParams} from 'react-router-dom';
import {NavLink, useNavigate} from 'react-router-dom';
import moment from 'moment';
import {useState, useEffect, useContext} from 'react';
import {OrderContext} from '../Context/order-context';
import {AuthContext} from '../Context/auth-context';


const OrderItemTrack=()=>{
//const {order_id, item_id, sub_category, category, type, image, item_status, update_date, status_updates}=useParams();
const {order_id, item_id}=useParams();

console.log(order_id, item_id);
const [showUpdates, setShowUpdates] = useState(false);
const [showUpdatesIcon, setShowUpdatesIcon] = useState('v');

const [orderDetails, setOrderDetails] = useState(null);
const [itemDetails, setItemDetails] = useState(null);
const [updates, setUpdates] = useState(null);
const {userId, token, isAdmin}=useContext(AuthContext);
const navigate=useNavigate();

useEffect(()=>{

    const fetchOrderDetails=async()=>{
        try{
            let response=await fetch(`http://localhost:5000/orders/orderDetails/${order_id}`);
            let {data}= await response.json();
            setOrderDetails(data);
            console.log(data);
             response=await fetch(`http://localhost:5000/orders/itemDetails/${order_id}/${item_id}`);
             ({data}= await response.json());
             console.log(data);
             //if (data && data.items && data.items.length > 0) {
                setItemDetails(data.items[0]);
                /* if(itemDetails){
                    console.log(itemDetails);
                    if(itemDetails.status_updates) setUpdates(itemDetails.status_updates);
                 }
                 else
                    console.log('updates not set', itemDetails.status_updates);*/
             }

        catch(error){
            console.log(error);
        }
    };
    fetchOrderDetails();
    /*if(itemDetails){
        console.log(itemDetails.status_updates);
        if(itemDetails.status_updates) setUpdates(itemDetails.status_updates);
     }
     else
        console.log('updates not set', itemDetails.status_updates);*/
  },[order_id, item_id]);

const toggleUpdates = () => {
    setShowUpdates(prevState => !prevState);
};


const returnItem = async (orderId, itemIds) => {
    const confirmMsg= window.confirm("Are you sure you want to return?");
    if(confirmMsg){
    try {
          const statusMsg=`Return initiated for ${itemIds.length} item(s) from order ${orderId}.\n Your payment refund will be initiated after the items reach our warehouse `;
          const currentDate = new Date().toISOString();
          const status_update={date:currentDate, message:statusMsg};

          let response = await fetch(`http://localhost:5000/orders/updateStatus`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({orderId, client_id:userId, items:itemIds, status:'returned', update_date:currentDate,  status_update:status_update}),
          });
    console.log(response);
      if (!response.ok) throw new Error('Failed to return orders');

            response = await fetch(`http://localhost:5000/vendor/returnOrder`, {      //userId is the client_id in Vendor
            method: 'PUT',
            headers: {
            //  'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({orderId, items:itemIds, status:'returned', update_date:currentDate, status_update:status_update, client_id:userId}),
          });
    console.log(response);

      if (!response.ok) throw new Error('Failed to dispatch orders');

        alert(statusMsg);
        } catch (err) {
          console.error(err.message);
          alert('Failed to return orders');
        }
      }
  }

const ButtonComponent = ({ order_id, item_id, buttonText }) => {
    return (
        <div style={{ display: 'flex' }}>

        <button
            style={{
                marginLeft: '0px',
                textDecoration: 'none',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontFamily: 'Ariel',
                fontSize: '20px',
                width:'300px'
            }}
            onClick={() => returnItem(order_id, [item_id])}
        >
            {buttonText || "Default Text"}
        </button>
        </div>
    );
};


return(
    <div style={{ marginLeft: '200px', marginTop:'100px', alignItems: 'center' }}>

<button
  style={{
    marginLeft: '0px',
    marginTop: '100px',
    alignItems: 'left',
    textDecoration: 'none',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    width:'300px'
  }}
  onClick={() => window.history.back()}
>
  Back
</button>

    <div style={{ marginLeft: '0px', alignItems: 'center' }}>
    <NavLink to={`/fabrics/${item_id}/${itemDetails?.category}`} style={{color:'blue',textDecoration:'none',border:'none'}}>
    <div style={{marginLeft:'20px',marginTop:'20px', display: 'flex', alignItems: 'center' }}>
    <img
    style={{width:'400px',height:'400px', margin:'40px'}} src={itemDetails && itemDetails.image[0]}/>
    <span style={{marginLeft:'20px',fontFamily: 'Ariel', fontSize: '20px' }}>{itemDetails && itemDetails.item_status==='created' ? 'Order confirmed':itemDetails && itemDetails.item_status} </span>
    </div>
    </NavLink>


    <div style={{textAlign: 'left' }}>
        <button
        style={{ width:'300px',marginLeft: '0px', textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Ariel', fontSize: '20px'  }}
        onClick={toggleUpdates}>Track Item <span style={{fontSize:'10px'}}>{showUpdatesIcon}</span></button>

        {showUpdates && itemDetails.status_updates && (
        <div style={{display:'flex',alignItems:'left'}}>
        <ul style={{marginLeft:'0px'}}>
       {itemDetails.status_updates.length>0 && itemDetails.status_updates.map((update, index) => {
           const update_date = moment(update.date).format('MMMM D, YYYY h:mm:ss A');
           return (
               <li key={index}>
                   <div>{update.message} - {update_date}</div>
               </li>);
        })}
        </ul>
        </div>
        )}
    </div>


{itemDetails && (itemDetails.item_status==='created') &&
<ButtonComponent order_id={order_id} item_id={item_id} buttonText="Return Item" />}

{itemDetails && itemDetails.item_status==='returned' &&
<div></div>}
</div>
</div>
);
}
export default OrderItemTrack;