import {useState, useEffect, useContext} from 'react';
import { Tabs, Tab } from '../components/Tabs';
import classes from './clientorders.module.css';
import {AuthContext} from '../Context/auth-context';

const ClientOrders = () => {
const apiBaseUrl = "http://localhost:5000"
//process.env.REACT_APP_API_BASE_URL;
const [activeTab,setActiveTab]=useState('Created');
const [activeOrders,setActiveOrders]=useState([]);
const [cancelledOrders,setCancelledOrders]=useState([]);
const [dispatchedOrders,setDispatchedOrders]=useState([]);
const [deliveredOrders,setDeliveredOrders]=useState([]);
const [returnedOrders,setReturnedOrders]=useState([]);

const [allOrders,setAllOrders]=useState([]);
const [selectedOrders, setSelectedOrders] = useState([]);
const {userId, token, isAdmin}=useContext(AuthContext);

    useEffect(()=>{
      const fetchOrders=async()=>{
      console.log(userId);

        if(userId){
          try{
          let url=null;
          console.log("admin",isAdmin);
          if(isAdmin){
                url=`${apiBaseUrl}/vendor/adminOrders/${userId}`;
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
                let filteredOrders;
                if(ordersData && ordersData.length){
                    setAllOrders(ordersData);
                    /*setActiveOrders(ordersData.filter((order)=>{
                         return order.clientOrders.length>0 && order.clientOrders.some(client_order => client_order.status === 'created')
                    }));*/
                     filteredOrders = ordersData
                                .map(order => ({
                                  ...order,
                                  clientOrders: order.clientOrders.filter(clientOrder => clientOrder.status === 'created')
                                }))
                                .filter(order => order.clientOrders.length > 0);

                      setActiveOrders(filteredOrders);

                     filteredOrders = ordersData
                                .map(order => ({
                                  ...order,
                                  clientOrders: order.clientOrders.filter(clientOrder => clientOrder.status === 'dispatched')
                                }))
                                .filter(order => order.clientOrders.length > 0);

                      setDispatchedOrders(filteredOrders);

                     filteredOrders = ordersData
                                  .map(order => ({
                                    ...order,
                                    clientOrders: order.clientOrders.filter(clientOrder => clientOrder.status === 'delivered')
                                  }))
                                  .filter(order => order.clientOrders.length > 0);

                    setDeliveredOrders(filteredOrders);

                    filteredOrders = ordersData
                                  .map(order => ({
                                    ...order,
                                    clientOrders: order.clientOrders.filter(clientOrder => clientOrder.status === 'returned')
                                  }))
                                  .filter(order => order.clientOrders.length > 0);

                    setReturnedOrders(filteredOrders);
                }
            }
            else{
                url=`${apiBaseUrl}/orders/clientOrders/${userId}`;
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
    },[userId, activeTab, selectedOrders]);

const dispatchOrders = async (status,newStatus) => {
    try {

      console.log(selectedOrders);
      const response = await fetch(`${apiBaseUrl}/vendor/changeOrderStatus/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({orderIds:selectedOrders,status:status,new_status:newStatus}),
      });

      if (!response.ok) throw new Error('Failed to dispatch orders');

      // Update the UI to reflect the dispatched orders
      setActiveOrders((prevOrders) => prevOrders.filter((order) => !selectedOrders.includes(order._id)));
      setSelectedOrders([]);
      alert('Orders dispatched successfully!');
    } catch (err) {
      console.error(err.message);
      alert('Failed to dispatch orders');
    }
    console.log(selectedOrders);
  };

 const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

    return (
<>
          {!isAdmin?(<Tabs>
            <Tab label="Recent">
              <div className={classes.heading}>Recent Orders</div>
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
              <div className={classes.heading}>Canceled Orders</div>
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
              <div className={classes.heading}>All Orders</div>
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
            (<Tabs  activeTab={activeTab} handleTabClick={setActiveTab} style={{width:'100%'}}>
            <Tab label="Created">
              <div className={classes.heading}>Created Orders</div>
              {activeOrders.length? (
                activeOrders.map(order => (
                  <div key={order.order_id} className={classes.order}>
                <div key={order.client_id}>Client ID: {order.client_id}</div>
                <div className={classes.order_summary}>
                    <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                    <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                    <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                    <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                    <div style={{textAlign:'center'}}><button style={{color:'black'}} onClick={()=>dispatchOrders('created','dispatched')}>Dispatch</button></div>
                </div>
                   { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                    <div key={clientOrder.order_id} className={classes.order_summary}>
                        <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                        <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_id}</div>
                        <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                        {clientOrder.item_details.map(item => (
                           <div style={{width:'300px',minWidth:'300px'}} key={item.id} className={classes.item}>
                           {item.type} {item.sub_category} {item.category}</div>))}
                        <input type="checkbox"  checked={selectedOrders.includes(clientOrder.order_id)} onChange={() => toggleOrderSelection(clientOrder.order_id)} />
                    </div>
                    </>))}
                    </div>

                ))
              ) : (
                <p>No active orders</p>
              )}
            </Tab>
            <Tab label="Dispatched">
              <div className={classes.heading}>Dispatched Orders</div>
              {dispatchedOrders.length? (
                  dispatchedOrders.map(order => (
                    <div key={order.order_id} className={classes.order}>
                  <div key={order.client_id}>Client ID: {order.client_id}</div>
                  <div className={classes.order_summary}>
                      <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                      <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                      <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                      <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                      <div style={{textAlign:'center'}}><button style={{color:'black'}} onClick={()=>dispatchOrders('dispatched','delivered')}>Delivered</button></div>
                  </div>
                     { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                      <div key={clientOrder.order_id} className={classes.order_summary}>
                          <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                          <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_id}</div>
                          <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                          {clientOrder.item_details.map(item => (
                             <div style={{width:'300px',minWidth:'300px'}} key={item.id} className={classes.item}>
                             {item.type} {item.sub_category} {item.category}</div>))}
                          <input type="checkbox"  checked={selectedOrders.includes(clientOrder.order_id)} onChange={() => toggleOrderSelection(clientOrder.order_id)} />
                      </div>
                      </>))}
                      </div>

                  ))
                ) : (
                  <p>No active orders</p>
                )}
            </Tab>
            <Tab label="Delivered" >
              <div className={classes.heading}>Delivered Orders</div>
              {deliveredOrders.length? (
                    deliveredOrders.map(order => (
                      <div key={order.order_id} className={classes.order}>
                    <div key={order.client_id}>Client ID: {order.client_id}</div>
                    <div className={classes.order_summary}>
                        <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                        <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                        <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                        <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                        <div style={{textAlign:'center'}}><button style={{color:'black'}} onClick={()=>dispatchOrders('delivered','returned')}>Returned</button></div>
                    </div>
                       { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                        <div key={clientOrder.order_id} className={classes.order_summary}>
                            <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                            <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_id}</div>
                            <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                            {clientOrder.item_details.map(item => (
                               <div style={{width:'300px',minWidth:'300px'}} key={item.id} className={classes.item}>
                               {item.type} {item.sub_category} {item.category}</div>))}
                            <input type="checkbox"  checked={selectedOrders.includes(clientOrder.order_id)} onChange={() => toggleOrderSelection(clientOrder.order_id)} />
                        </div>
                        </>))}
                        </div>

                    ))
                  ) : (
                    <p>No active orders</p>
                  )}
            </Tab>
            <Tab label="Returned">
              <div className={classes.heading}>Returned Orders</div>
               {returnedOrders.length? (
                  returnedOrders.map(order => (
                    <div key={order.order_id} className={classes.order}>
                  <div key={order.client_id}>Client ID: {order.client_id}</div>
                  <div className={classes.order_summary}>
                      <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                      <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                      <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                      <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                      <div style={{textAlign:'center'}}><button style={{color:'black'}} onClick={()=>dispatchOrders('returned','closed')}>Order Refunded</button></div>
                  </div>
                     { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                      <div key={clientOrder.order_id} className={classes.order_summary}>
                          <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                          <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_id}</div>
                          <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                          {clientOrder.item_details.map(item => (
                             <div style={{width:'300px',minWidth:'300px'}} key={item.id} className={classes.item}>
                             {item.type} {item.sub_category} {item.category}</div>))}
                          <input type="checkbox"  checked={selectedOrders.includes(clientOrder.order_id)} onChange={() => toggleOrderSelection(clientOrder.order_id)} />
                      </div>
                      </>))}
                      </div>

                  ))
                ) : (
                  <p>No returned orders</p>
                )}
            </Tab></Tabs>
            )
    }

        </>
      );
    }

export default ClientOrders;
