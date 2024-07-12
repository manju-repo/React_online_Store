import {useState, useEffect, useContext} from 'react';
import { Tabs, Tab } from '../components/Tabs';
import classes from './clientorders.module.css';
import {AuthContext} from '../Context/auth-context';

const ClientOrders = () => {
const [activeOrders,setActiveOrders]=useState([]);
const [cancelledOrders,setCancelledOrders]=useState([]);
const [allOrders,setAllOrders]=useState([]);
const [showDetails, setShowDetails] = useState({}); // State to manage visibility of client details
const {userId, token, isAdmin}=useContext(AuthContext);
    useEffect(()=>{
      const fetchOrders=async()=>{
      console.log(userId);

        if(userId){
          try{
          let url=null;
          console.log("admin",isAdmin);
          if(isAdmin){
                url=`http://localhost:5000/vendor/adminOrders/${userId}`;
                const response=await fetch(url,{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                },});
                console.log(response);
                if(!response)
                    throw new Error('Could not fetch your orders');
                const ordersResp=await response.json();
                console.log(ordersResp);
                const ordersData=ordersResp.data;
                if(ordersData && ordersData.length){
                    setAllOrders(ordersData);
                    setActiveOrders(ordersData.filter((order)=>{
                    if (isAdmin) {
                        return order.clientOrders.length>0 && order.clientOrders[0].status==='created';
                    }
                    else
                        return  order.status==='created';
                    }));
                    setCancelledOrders(ordersData.filter((order)=>order.status==='cancelled'));
                    //console.log(orders.length);
                    console.log(activeOrders.length);

                }
            }
            else{
                url=`http://localhost:5000/orders/clientOrders/${userId}`;
                const response=await fetch(url,{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                },});
                console.log(response);
                if(!response)
                    throw new Error('Could not fetch your orders');
                const ordersResp=await response.json();
                console.log(ordersResp);
                const orders=ordersResp.data;
                console.log(orders);
                if(orders.length){
                    console.log(orders[0].items[0]);
                    setAllOrders(orders);
                    setActiveOrders(orders.filter((order)=>order.status==='created'));
                    setCancelledOrders(orders.filter((order)=>order.status==='cancelled'));

                }
            }
          }catch(err){
            console.log(err.message);
          }
        }
      }
      fetchOrders();
    },[userId]);

const toggleDetails = (orderId) => {
        setShowDetails(prevState => ({
            ...prevState,
            [orderId]: !prevState[orderId]
        }));
    };


    return (
<>
          {!isAdmin?(<Tabs>
            <Tab label="Recent">
              <h2>Recent Orders</h2>
              {activeOrders.length > 0 ? (
                activeOrders.map(order => (
                  <div key={order._id} className={classes.order}>
                    order.clientOrders.map(clientOrder => (
                    <div  className={classes.order_summary}>
                        <span style={{width:'200px'}}>Order ID: {order.clientOrder.order_id}</span>
                        <span>Status: {order.clientOrder.status}</span>
                        <span>Amount: {order.clientOrder.client_id}</span>
                        <span>Items: {order.clientOrder.quantity}
                        {order.clientOrder.item_details.map(item => (
                           <div key={item.id} className={classes.item}>
                           {item.type} {item.sub_category} {item.category}</div>))}
                       </span>
                    </div>
                    ))
                  </div>
                ))
              ) : (
                <p>No active orders found.</p>
              )}
            </Tab>
            <Tab label="Canceled">
              <h2>Canceled Orders</h2>
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map(order => (
                  <div key={order.id} className={classes.order}>
                    <p>Order ID: {order.id}</p>
                    <p>Status: {order.status}</p>
                    <p>Amount: {order.amount}</p>
                  </div>
                ))
              ) : (
                <p>No canceled orders found.</p>
              )}
            </Tab>
            <Tab label="All">
              <h2>All Orders</h2>
              {allOrders.length > 0 ? (
                allOrders.map(order => (
                  <div key={order.id} className={classes.order}>
                    <p>Order ID: {order.id}</p>
                    <p>Status: {order.status}</p>
                    <p>Amount: {order.amount}</p>
                    {/* Add other order details as needed */}
                  </div>
                ))
              ) : (
                <p>No orders found.</p>
              )}
            </Tab></Tabs>
            ):
            (<Tabs  style={{width:'100%'}}>
            <Tab label="Created">
              <h2>Created Orders</h2>
              {activeOrders.length? (
                activeOrders.map(order => (
                  <div key={order.order_id} className={classes.order}>
                <div key={order.client_id}>Client ID: {order.client_id}</div>
                <div className={classes.order_summary}>
                    <div style={{width:'20%',minWidth:'20%'}}>Order ID</div>
                    <div style={{width:'20%',minWidth:'20%'}}>Item code</div>
                    <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                    <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                    <div><button>Dispatch</button></div>
                </div>
                       { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                        <div key={clientOrder.order_id} className={classes.order_summary}>
                            <div style={{width:'20%',minWidth:'20%'}}>{clientOrder.order_id}</div>
                            <div style={{width:'20%',minWidth:'20%'}}>{clientOrder.item_id}</div>
                            <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                            {clientOrder.item_details.map(item => (
                               <div style={{width:'300px',minWidth:'300px'}} key={item.id} className={classes.item}>
                               {item.type} {item.sub_category} {item.category}</div>))}
                            <div><input type="checkbox"/></div>
                        </div>
                        </>))}
                    </div>

                ))
              ) : (
                <p>No active orders</p>
              )}
            </Tab>
            <Tab label="Dispatched">
              <h2>Dispatched Orders</h2>
              {cancelledOrders.length? (
                cancelledOrders.map(order => (
                  <div key={order.id} className={classes.order}>
                    <p>Order ID: {order.id}</p>
                    <p>Status: {order.status}</p>
                    <p>Amount: {order.amount}</p>
                    {/* Add other order details as needed */}
                  </div>
                ))
              ) : (
                <p>No orders dispatched</p>
              )}
            </Tab>
            <Tab label="Delivered">
              <h2>Delivered Orders</h2>
              {allOrders.length ? (
                allOrders.map(order => (
                  <div key={order.id} className={classes.order}>
                    <p>Order ID: {order.id}</p>
                    <p>Status: {order.status}</p>
                    <p>Amount: {order.amount}</p>
                    {/* Add other order details as needed */}
                  </div>
                ))
              ) : (
                <p>No orders delivered</p>
              )}
            </Tab>
            <Tab label="Returned">
              <h2>Returned Orders</h2>
              {allOrders.length ? (
                allOrders.map(order => (
                  <div key={order.id} className={classes.order}>
                    <p>Order ID: {order.id}</p>
                    <p>Status: {order.status}</p>
                    <p>Amount: {order.amount}</p>
                    {/* Add other order details as needed */}
                  </div>
                ))
              ) : (
                <p>No orders returned</p>
              )}
            </Tab></Tabs>
            )
    }

        </>
      );
    }

export default ClientOrders;
