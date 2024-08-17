import {useState, useEffect, useContext} from 'react';
import { Tabs, Tab } from '../components/Tabs';
import classes from './clientorders.module.css';
import {AuthContext} from '../Context/auth-context';
import {NavLink, useNavigate} from 'react-router-dom';
import moment from 'moment';

const ClientOrders = () => {
const apiBaseUrl = "http://localhost:5000"
//process.env.REACT_APP_API_BASE_URL;
const [activeTab,setActiveTab]=useState('Created');
const [allOrders,setAllOrders]=useState([]);
const [activeOrders,setActiveOrders]=useState([]);
const [confirmedOrders,setConfirmedOrders]=useState([]);
const [cancelledOrders,setCancelledOrders]=useState([]);
const [dispatchedOrders,setDispatchedOrders]=useState([]);
const [deliveredOrders,setDeliveredOrders]=useState([]);
const [returnedOrders,setReturnedOrders]=useState([]);
const [refundedOrders,setRefundedOrders]=useState([]);

const [closedOrders,setClosedOrders]=useState([]);

const [selectedOrders, setSelectedOrders] = useState([]);
const [adminSelectedOrders, setAdminSelectedOrders] = useState([]);
const [paymentId, setPaymentId] = useState(null);
const [amount, setAmount] = useState(0);
const {userId, token, isAdmin, isLoggedIn}=useContext(AuthContext);
    const navigate=useNavigate();




useEffect(()=>{

      const fetchOrders=async()=>{
      console.log(userId);

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
                console.log(ordersData);
                if(ordersData && ordersData.length){
                    setAllOrders(ordersData);

                     const filterOrders = (status) =>
                        ordersData
                                .map(order => ({
                                      ...order,
                                      clientOrders: order.clientOrders.filter(clientOrder =>
                                        clientOrder.item_details.item_status === status)
                                    })).filter(order => order.clientOrders.length > 0);

                      setActiveOrders(filterOrders('created'));
                      setDispatchedOrders(filterOrders('dispatched'));
                      setDeliveredOrders(filterOrders('delivered'));
                      setReturnedOrders(filterOrders('returned'));
                      setRefundedOrders(filterOrders('refunded'));
                      setClosedOrders(filterOrders('closed'));
                      //setClosedOrders(ordersData.filter(order => order.clientOrders.some(clientOrder=>clientOrder.status === 'closed')));
                    if(refundedOrders) console.log(refundedOrders);
                    if(closedOrders) console.log(closedOrders);
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
                const orders=ordersResp.data;
                console.log(orders);
                if(orders && orders.length){
                    setAllOrders(orders);

                     const filterOrders = (status) =>
                       orders
                         .filter(order => order.status === 'created') // Add this condition to filter orders by status
                         .map(order => ({
                           ...order,
                           items: order.items.filter(item => item.item_status === status) // Filter items by status
                         }))
                         .filter(order => order.items.length > 0); // Ensure the order has items left after filtering
console.log(allOrders);

                      setActiveOrders(allOrders.filter(order => order.status === 'created'));
                      setConfirmedOrders(filterOrders('created'));
                      setReturnedOrders(filterOrders('returned'));
                      setCancelledOrders(orders.filter(order => order.status === 'cancelled'));
                      setClosedOrders(orders.filter(order => order.status === 'closed'));
                  if (closedOrders) console.log(closedOrders);
                }
            }
          }catch(err){
            console.log(err.message);
          }

      }
      fetchOrders();
    },[userId, navigate, activeTab, selectedOrders, adminSelectedOrders]);

    const refundPayment = async()=>{
        console.log(paymentId, amount);
        try{
             const responseUser=await fetch(`http://localhost:5000/user/${userId}`);
             if(responseUser){
                const userData=await responseUser.json();
                console.log(userData);
                const response=await fetch('http://localhost:5000/payment/paymentRefund',{
                                                  method:'POST',
                                                  headers:{
                                                        'Authorization': `Bearer ${token}`,
                                                        'content-type':'application/json'},
                                                  body:JSON.stringify({amount:amount, paymentId:paymentId})
                                              });
                 console.log(response);
                setAmount(0);
                setPaymentId(null);

                if(response){
                    const resData=await response.json();
                    console.log(resData);
                    return { success: resData.success, data: resData.data };
                }
            }
        }catch(error){
            console.log(error);
            return { success: false, error: error.message };
        }

        };

    const fetchOrderDetails = async(order_id,item_ids) =>{
           try{
                let response=await fetch(`http://localhost:5000/orders/orderDetails/${order_id}`);
                let {data}= await response.json();
                console.log(data.rzr_payment_id);
                setPaymentId(data.rzr_payment_id);

                for (const item_id of item_ids) {
                    response=await fetch(`http://localhost:5000/orders/itemDetails/${order_id}/${item_id}`);
                    ({data}= await response.json());
                    console.log(data.items[0].amount);
                    setAmount(amount+data.items[0].amount);
                }
            if (data && amount) console.log(paymentId,amount);

            }
            catch(error){
                console.log(error);
            }
    }

    const dispatchOrders = async (client_id, newStatus) => {
        console.log(adminSelectedOrders);
        if(!adminSelectedOrders || adminSelectedOrders.length===0) {
            alert("Select items by checking the boxes");
            return;
        }
         const currentDate = new Date().toISOString();

            const ordersForClient = adminSelectedOrders.find(item => item.clientId === client_id).orders;

             const itemsOfOrder = ordersForClient.reduce((acc, order) => {
             const { orderId, itemId } = order;
             const existingOrder = acc.find(entry => entry.orderId === orderId);
             if (existingOrder) {
               existingOrder.itemIds.push(itemId);
             } else {
               acc.push({ orderId, itemIds: [itemId] });
             }
             return acc;
           }, []);

           console.log(ordersForClient[0]);
           console.log(itemsOfOrder);


console.log(ordersForClient[0]);
console.log(itemsOfOrder);

   try {
   let response, status_update;
    for (const order of itemsOfOrder) {

         let statusMsg='';
         switch(newStatus){
            case 'dispatched': statusMsg=`${order.itemIds.length} item(s) from your order ${order.orderId} have been dispatched on ${currentDate}.\n They will be delivered to you in 2/3 working days `;
            break;
            case 'delivered': statusMsg=`${order.itemIds.length} item(s) from your order ${order.orderId} have been delivered on ${currentDate}. `;
            break;
            case 'refunded':
            {
                console.log(adminSelectedOrders);
                statusMsg=`Refund for ${order.itemIds.length} item(s) has been initiated on ${currentDate}. It will be credited to your account in 2/3 working days `;
                fetchOrderDetails(order.orderId, [order.itemIds]);
                if(paymentId && amount)
                    console.log(paymentId, amount);
                else{
                    alert("Unable to refund. Please try again later!")
                    return;
                }
                if(paymentId && amount){
                    console.log("refunding");
                    const result = await refundPayment();
                     if(!result.success){
                        alert("Unable to refund. Please try again!");
                        return;
                     }
                 }
                break;
            }
        }
             status_update={date:currentDate, message:statusMsg};
             console.log(status_update);
             response = await fetch(`${apiBaseUrl}/vendor/changeOrderStatus/${userId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({orderId:order.orderId, items:order.itemIds, status:newStatus, update_date:currentDate, status_update:status_update}),
          });

          if (!response.ok) throw new Error('Failed to dispatch orders');
console.log(response);

         response = await fetch(`${apiBaseUrl}/orders/updateStatus`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({orderId:order.orderId, client_id:client_id, status_update:status_update, items:order.itemIds, status:newStatus, update_date:currentDate }),
          });

      if (!response.ok) throw new Error('Failed to return orders');
console.log(response);
    }

      setAdminSelectedOrders([]);
      alert('Orders dispatched successfully!');
    } catch (err) {
      console.error(err.message);
      alert('Failed to dispatch orders');
    }

}

const updateOrderStatus = async (orderId, itemIds, status, newStatus) => {
    const confirmMsg= window.confirm("Are you sure you want to return?");
    if(confirmMsg){
    try {
          const statusMsg=`Return initiated for $(itemIds.length) item(s) from order $(orderId).\n Your payment refund will be initiated after the items reach our warehouse `;
          const currentDate = new Date().toISOString();
          const status_update={date:currentDate, message:statusMsg};

          const response = await fetch(`http://localhost:5000/orders/updateStatus`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({orderId, client_id:userId, items:itemIds, status:newStatus, update_date:currentDate,  status_update:status_update}),
          });

      if (!response.ok) throw new Error('Failed to return orders');

            response = await fetch(`http://localhost:5000/vendor/returnOrder`, {      //userId is the client_id in Vendor
            method: 'PUT',
            headers: {
            //  'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({orderId, items:itemIds, status:newStatus, update_date:currentDate, status_update:status_update, client_id:userId}),
          });

      if (!response.ok) throw new Error('Failed to dispatch orders');

        setSelectedOrders([]);
        alert(statusMsg);
        } catch (err) {
          console.error(err.message);
          alert('Failed to return orders');
        }
        console.log(selectedOrders);
      }
  }

const toggleOrderSelection = (orderId, itemId) => {
    setSelectedOrders((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (!newSelected[orderId]) {
        newSelected[orderId] = [];
      }
      if (newSelected[orderId].includes(itemId)) {
        newSelected[orderId] = newSelected[orderId].filter((id) => id !== itemId);
        if (newSelected[orderId].length === 0) delete newSelected[orderId];
      } else {
        newSelected[orderId].push(itemId);
      }
      return newSelected;
    });
  };

const admin_toggleOrderSelection = (clientId, orderId, itemId) => {
console.log(clientId, orderId, itemId);
console.log(adminSelectedOrders);
  setAdminSelectedOrders((prevSelected) => {
    const newSelected = [...prevSelected];
    const clientIndex = newSelected.findIndex(item => item.clientId === clientId);

    console.log('========', JSON.stringify(newSelected), orderId, itemId, "===========");
    console.log(clientIndex);

    if (clientIndex === -1) {
      // If clientId is not present, add a new entry
      newSelected.push({ clientId, orders: [{ orderId, itemId }] });
    } else {
      // If clientId is present, toggle the order selection
      const clientOrders = [...newSelected[clientIndex].orders]; // Clone the clientOrders array

      console.log(JSON.stringify(clientOrders));

      const orderIndex = clientOrders.findIndex(
        order => order.orderId === orderId && order.itemId === itemId
      );

      console.log(orderIndex);

      if (orderIndex !== -1) {
        // If the order is present, remove it
        clientOrders.splice(orderIndex, 1);
        if (clientOrders.length === 0) {
          // Remove the client entry if no orders left
          newSelected.splice(clientIndex, 1);
        } else {
          // Update the orders for the client
          newSelected[clientIndex] = { ...newSelected[clientIndex], orders: clientOrders };
        }
      } else {
        // If the order is not present, add it
        clientOrders.push({ orderId, itemId });
        // Update the orders for the client
        newSelected[clientIndex] = { ...newSelected[clientIndex], orders: clientOrders };
      }
    }

    console.log(JSON.stringify(newSelected));

    return newSelected;
  });
};





    return (
<>
      {!isAdmin?(
      <>
      <Tabs  style={{width:'100%'}}>
        <Tab label="Recent Orders">
          <div><b>Recent Orders</b></div>
          {confirmedOrders && confirmedOrders.length > 0 ? (
            confirmedOrders.map(order => ((
            <div key={order._id} style={{ border: 'solid 1px', maxWidth: '1200px', margin: '0 auto' }}>
                <div>
                    <ul>
                    {order.items.map(item => (
                        <li key={item.id} >
                        <NavLink style={{color:'blue',textDecoration:'none',border:'none', display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                        to={`/order_item_track/${order._id}/${item.id}`}>
                             <div style={{width:'100px',minWidth:'100px'}}><img style={{height:'100px',width:'100px'}} src={item.image[0]}/></div>
                             <div>
                                 <div style={{width:'400px',minWidth:'400px', textAlign:'left'}}>{item.type} {item.sub_category} {item.category}</div>
                                 <div style={{width:'400px',minWidth:'400px', textAlign:'left'}}>{item.item_status} {moment(item.update_date).format('MMMM D, YYYY h:mm:ss A')}</div>
                             </div>
                        </NavLink>
                        </li>)
                     )}
                     </ul>
               </div>
            </div>
                )))
          ):
           <div style={{textAlign:'left'}}>No recent Orders</div>
        }
        { closedOrders && closedOrders.length > 0 && (<>
        <div><b>Buy again</b></div>
        { closedOrders.map(order => (
        <ul key={order._id} className={classes.grid_list}>
        {order.items && order.items.length>0 && (
         order.items.map(item =>
             <li key={item.id} className={classes.grid_item}>
             <NavLink style={{color:'blue',textDecoration:'none',border:'none'}}
                to={`/fabrics/${item.id}/${item.category}`}>
                  <div style={{width:'100px',minWidth:'100px'}}><img style={{height:'100px',width:'100px'}} src={item.image[0]}/></div>
                  <div style={{width:'400px',minWidth:'400px', textAlign:'left'}}>{item.desc}</div>
             </NavLink>
             </li>)
          )}
          </ul>
          ))}
          </>)}

        </Tab>

        <Tab label="Returned">
          <div><b>Returned Orders</b></div>
          {returnedOrders && returnedOrders.length > 0 ? (
            returnedOrders.map(order => (
            <div key={order._id} style={{ border: 'solid 1px', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
                <ul>
                {order.items.map(item => (
                    <li key={item.id} style={{display: 'flex', alignItems: 'center'}}>
                    <NavLink style={{color:'blue',textDecoration:'none',border:'none',  marginBottom: '10px' }}
                to={`/fabrics/${item.id}/${item.category}`}>
                        <div>
                         <div style={{width:'100px',minWidth:'100px'}}><img style={{height:'100px',width:'100px'}} src={item.image[0]}/></div>
                         <div style={{width:'400px',minWidth:'400px', textAlign:'left'}}>{item.desc}</div>
                         </div>
                    </NavLink>

                         {item.status_updates && item.status_updates.length > 0 && (
                             <div style={{width:'400px',minWidth:'400px', textAlign:'left'}}>{ item.status_updates[item.status_updates.length-1].message} {moment(item.update_date).format('MMMM D, YYYY h:mm:ss A')}</div>
                         )}
                    </li>)
                 )}
                 </ul>
           </div>
        </div>
                ))
          ) : (
            <p>No returned orders found.</p>
          )}
        </Tab>

        <Tab label="Canceled">
          <div><b>Canceled Orders</b></div>
          {cancelledOrders && cancelledOrders.length > 0 ? (
            cancelledOrders.map(order => (
            <div>
            <ul  style={{display: 'flex', alignItems: 'center'}}>
            {order.items.map(item => (
                <li key={item.id}>
                <NavLink style={{color:'blue',textDecoration:'none',border:'none',  marginBottom: '10px' }}
                to={`/fabrics/${item.id}/${item.category}`}>
                    <div>
                     <div style={{width:'100px',minWidth:'100px'}}><img style={{height:'100px',width:'100px'}} src={item.image[0]}/></div>
                     <div style={{width:'200px',minWidth:'200px', textAlign:'left'}}>{item.desc}</div>
                     </div>
                </NavLink>
                </li>)
             )}
             </ul>
            </div>
                ))
          ) : (
            <p>No canceled orders found.</p>
          )}
        </Tab>
        </Tabs></>
        ):              //Admin
        (<Tabs  activeTab={activeTab} handleTabClick={setActiveTab} style={{width:'100%'}}>
        <Tab label="Confirmed">
          <div className={classes.heading}>Created Orders</div>
          {activeOrders && activeOrders.length? (
            activeOrders.map(order => (
              <div className={classes.orderContainer} style={{border:'1px solid'}} >

            <div key={order.client_id}>Client Id: {order.client_id}</div>
            <div className={classes.order_summary}>
                <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                <div style={{textAlign:'center'}}><button style={{color:'black'}} onClick={()=>dispatchOrders(order.client_id,'dispatched')}>Dispatch</button></div>
            </div>
           { order.clientOrders && order.clientOrders.map(clientOrder => (<>
            <div key={clientOrder.order_id} className={classes.order_summary}>
                <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_details.id}</div>
                <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                <div style={{width:'300px',minWidth:'300px'}}>
                    {clientOrder.item_details.desc}
                </div>
               <input
                 type="checkbox"
                 checked={
                   adminSelectedOrders
                     .find(item => item.clientId === order.client_id)
                     ?.orders.some(
                       (order) =>
                         order.orderId === clientOrder.order_id &&
                         order.itemId ===clientOrder.item_details.id
                     ) || false
                 } onChange={() => admin_toggleOrderSelection(order.client_id, clientOrder.order_id, clientOrder.item_details.id)}
               />

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
          {dispatchedOrders && dispatchedOrders.length? (
              dispatchedOrders.map(order => (
              <div className={classes.orderContainer} style={{border:'1px solid'}} >
              <div key={order.client_id}>Client ID: {order.client_id}</div>
              <div className={classes.order_summary}>
                  <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                  <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                  <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                  <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                  <div style={{textAlign:'center'}}><button style={{color:'black'}} onClick={()=>dispatchOrders(order.client_id,'delivered')}>Delivered</button></div>
              </div>
                 { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                  <div key={clientOrder.order_id} className={classes.order_summary}>
                      <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                      <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_details.id}</div>
                      <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                      <div style={{width:'300px',minWidth:'300px'}}>{clientOrder.item_details.desc}</div>
                <input
                 type="checkbox"
                 checked={
                   adminSelectedOrders
                     .find(item => item.clientId === order.client_id)
                     ?.orders.some(
                       (order) =>
                         order.orderId === clientOrder.order_id &&
                         order.itemId === clientOrder.item_details.id
                     ) || false
                 } onChange={() => admin_toggleOrderSelection(order.client_id, clientOrder.order_id, clientOrder.item_details.id)}
               />
               </div>
              </>))}
              </div>
              ))
            ) : (
              <p>No dispatched orders</p>
            )}
        </Tab>
        <Tab label="Delivered" >
          <div className={classes.heading}>Delivered Orders</div>
          {deliveredOrders &&  deliveredOrders.length? (
                deliveredOrders.map(order => (
              <div className={classes.orderContainer} style={{border:'1px solid'}} >
                <div key={order.client_id}>Client Id:<b> {order.client_id}</b></div>
                <div className={classes.order_summary}>
                    <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                    <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                    <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                    <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                </div>
                   { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                    <div key={clientOrder.order_id} className={classes.order_summary}>
                        <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                        <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_details.item_id}</div>
                        <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                        <div style={{width:'300px',minWidth:'300px'}}>{clientOrder.item_details.desc} </div>
                    </div>
                    </>))}
                    </div>
                    ))
                  ) : (
                <p>No delivered orders</p>
              )}
        </Tab>
        <Tab label="Returned">
          <div className={classes.heading}>Returned Orders</div>
           { returnedOrders && returnedOrders.length? (
              returnedOrders.map(order => (
              <div className={classes.orderContainer} style={{border:'1px solid'}} >
              <div key={order.client_id}>Client Id:<b> {order.client_id}</b></div>
              <div className={classes.order_summary}>
                  <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                  <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                  <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                  <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                  <div style={{textAlign:'center'}}><button style={{color:'black'}} onClick={()=>dispatchOrders(order.client_id,'refunded')}>Order Refunded</button></div>
              </div>
                 { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                  <div key={clientOrder.order_id} className={classes.order_summary}>
                      <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                      <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_details.id}</div>
                      <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                      <div style={{width:'300px',minWidth:'300px'}}>{clientOrder.item_details.desc}</div>
              <input
                 type="checkbox"
                 checked={
                   adminSelectedOrders
                     .find(item => item.clientId === order.client_id)
                     ?.orders.some(
                       (order) =>
                         order.orderId === clientOrder.order_id &&
                         order.itemId === clientOrder.item_details.id
                     ) || false
                 } onChange={() => admin_toggleOrderSelection(order.client_id, clientOrder.order_id, clientOrder.item_details.id)}
              />
            </div>
             </>))}
             </div>
             ))
               ) : (
              <p>No returned orders</p>
            )}
        </Tab>

        <Tab label="Refunded" >
                  <div className={classes.heading}>Refunded Orders</div>
                  {refundedOrders &&  refundedOrders.length? (
                        refundedOrders.map(order => (
                      <div className={classes.orderContainer} style={{border:'1px solid'}} >
                        <div key={order.client_id}>Client Id:<b> {order.client_id}</b></div>
                        <div className={classes.order_summary}>
                            <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                            <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                            <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                            <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                        </div>
                           { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                            <div key={clientOrder.order_id} className={classes.order_summary}>
                                <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                                <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_details.id}</div>
                                <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                                <div style={{width:'300px',minWidth:'300px'}}>{clientOrder.item_details.desc} </div>
                            </div>
                            </>))}
                            </div>
                            ))
                          ) : (
                        <p>No orders refunded</p>
                      )}
                </Tab>

                <Tab label="Closed" >
                          <div className={classes.heading}>Closed Orders</div>
                          {closedOrders &&  closedOrders.length? (
                                closedOrders.map(order => (
                              <div className={classes.orderContainer} style={{border:'1px solid'}} >
                                <div key={order.client_id}>Client Id:<b> {order.client_id}</b></div>
                                <div className={classes.order_summary}>
                                    <div style={{width:'250px',minWidth:'250px'}}>Order ID</div>
                                    <div style={{width:'250px',minWidth:'250px'}}>Item code</div>
                                    <div style={{width:'100px',minWidth:'100px'}}>Quantity</div>
                                    <div style={{width:'300px',minWidth:'300px'}}>Item Description</div>
                                </div>
                                   { order.clientOrders && order.clientOrders.map(clientOrder => (<>
                                    <div key={clientOrder.order_id} className={classes.order_summary}>
                                        <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.order_id}</div>
                                        <div style={{width:'250px',minWidth:'250px'}}>{clientOrder.item_details.id}</div>
                                        <div style={{width:'100px',minWidth:'100px'}}>{clientOrder.quantity}</div>
                                        <div style={{width:'300px',minWidth:'300px'}}>{clientOrder.item_details.desc}</div>
                                    </div>
                                    </>))}
                                    </div>
                                    ))
                                  ) : (
                                <p>No closed orders</p>
                              )}
                        </Tab>

        </Tabs>
        )
}

        </>
      );
    }

export default ClientOrders;
