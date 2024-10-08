import {useContext, useState, useEffect} from 'react';
import {useNavigate, NavLink} from 'react-router-dom';
import { AuthContext } from '../Context/auth-context';
import {NotificationContext} from '../Context/notification-context';
import moment from 'moment';
import classes from './notification.module.css';
import SubscriptionForm from './SubscriptionForm.js';

const Notifications=()=>{
 const {isAdmin,superAdmin, isLoggedIn, token, isSubscribed}=useContext(AuthContext);
 const notCtx=useContext(NotificationContext);
 const [notifications,setNotifications] = useState(null);
 const [errors,setErrors] =useState(null);
 const [zoomed,setZoomed] =useState(null);
 const navigate=useNavigate();

useEffect(()=>{
    const fetchNotifications=async()=>{
    console.log('in fetch', isSubscribed);
    try{
        let response;
        if(isAdmin)
             response=await fetch('http://localhost:5000/notifications',{
               method:'GET',
               headers:{
                   'Content-Type':'application/json',
                    'Authorization':'Bearer '+ token}
               });
        else
             response=await fetch('http://localhost:5000/notifications/user',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                     'Authorization':'Bearer '+ token}
                });

        console.log(superAdmin);
         if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }
        const {notifications}=await response.json();
        console.log(notifications);
        if(notifications)
            setNotifications(notifications);


         response=await fetch('http://localhost:5000/notifications/markAsRead',{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                     'Authorization':'Bearer '+ token}
                });
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to update notifications');
             }
             const data = await response.json();
             console.log(data);
            const newNotifications= notifications?.filter((notification)=>notification.readByUser===false);
            localStorage.setItem('Notifications',JSON.stringify(newNotifications));
        }
        catch(error){
            console.log(error);
            setErrors("Could not load Notifications");
        }
    }


    /*const deleteFabric = async(dispatch)=>{
      try{
           const response=await fetch(
                    `http://localhost:5000/fabrics/${id}`,
                    { method:'DELETE',
                      headers:{Authorization:'Bearer '+ authCtx.token}
                    }
                  );
           if(! response.ok)
                throw new Error("Could not delete the Fabric");
           const resData = await response.json();
           console.log(resData);
           updateFabricList();
           navigate('/store/'+category);
        }
        catch(error){
            console.log(error);
            }
        }
      deleteFabric(dispatch);
   }*/
    if(isSubscribed.pushSubscribed)
         fetchNotifications();
},[token, isAdmin, isSubscribed]);

const addNotificationHandler = () => {
       navigate(`/notifications/new`);
   }

 const removeEntryHandler = (event) => {
  event.preventDefault(); // Prevent the default anchor tag behavior
   event.stopPropagation(); // Stop the click from propagating to the NavLink
    return;
 }

 const approveNotificationHandler=async(notificationId, approved)=>{
   const newStatus = !approved; // Toggle the approved state
    //alert(` ${notificationId} ${newStatus}`);
    try{
        const response = await fetch(`http://localhost:5000/notifications/approve/${notificationId}`, {
              method: 'PUT',
              headers:{
                        'Content-Type': 'application/json',
                        'Authorization':'Bearer '+ token
              },
              body: JSON.stringify({ approved: newStatus }), // Send the new status to the backend
        });

        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        setNotifications((prevNotifications) =>
              prevNotifications.map((notification) =>
                notification._id === notificationId ? { ...notification, approved: newStatus } : notification
              )
        );
    }catch(error){
        console.log("Could not approve",error);
    }
 }

const imageClickHandler=(notId,prodId)=>{

    if(prodId)
        navigate(`/fabrics/${prodId}/fabrics`);
    else
        setZoomed((prevZoomedProdId) =>prevZoomedProdId === notId ? null : notId);
}

 return(<>
    {(isLoggedIn && !isAdmin)&&(<>
        <SubscriptionForm/>
    </>)
    }
    {(isSubscribed.pushSubscribed===true)?(<>
    {(isLoggedIn && isAdmin) ? (<>
        <div style={{textAlign:'center',marginBottom:'40px',marginTop:'40px'}}>
        <button onClick={addNotificationHandler} className={classes.button} >New Notification</button>
        </div>
    {(notifications && notifications?.length===0)|| errors && (
        <div style={{textAlign:'center',marginBottom:'40px',marginTop:'40px'}}>
        <p>{errors}</p>
        </div>
    )}
    <ul>
      {notifications && notifications.map((notification) => (

         <li key={notification._id} style={{display:'flex',width:'100%', border:'2px solid pink'}}>
            <NavLink style={{textDecoration:'none',width:'100%',marginLeft:'10px',textAlign:'left'}} to={{pathname:`/notifications/edit/${notification._id}` }}  className={classes.ticket}>
                <div style={{minWidth:'300px',width:'300px', wordWrap: 'break-word',
                whiteSpace: 'normal',overflow:'hidden'}}>{notification.notificationMsg}</div>
                {notification.imageUrl &&
                (<div><img src={notification.imageUrl} alt="No image" style={{width:'100px', height:'100px',marginLeft:'200px', marginRight:'10px'}}/></div>)}
            </NavLink>
            {superAdmin && (<div style={{marginRight:'20px'}}><button onClick={()=>approveNotificationHandler(notification._id, notification.approved)}>
            {notification.approved?'Disapprove':'Approve'}
            </button></div>)}
          </li>))}
    </ul></>
    ):(<>
    {errors ? (<><p>{errors}</p>
        <div style={{textAlign:'center',marginBottom:'40px',marginTop:'40px'}}>
           <p>There are no Notifications for now!</p>
        </div>
    </>):(<><p>{notCtx.notifications?.length} Unread message(s)</p>
    {(notifications && notifications?.length>0) ?
            notifications.map((notification) => (
            <div style={{ border:'2px solid pink'}}>
                <div style={{minWidth:'300px',width:'80%', wordWrap: 'break-word', marginLeft:'5%',
                whiteSpace: 'normal',overflow:'hidden',  fontWeight: notification.readByUser===false ? 'bold' : 'normal' }}>
                {notification.notificationMsg}</div>
                {notification.imageUrl &&
                (<div><img className={`${classes.imageclass} ${zoomed===notification._id ? classes.magnifier: ''}`} onClick={()=>imageClickHandler(notification._id,notification.productCode)} src={notification.imageUrl} alt="No image" /></div>)}
            </div>)
            ) :  (
             <div style={{textAlign:'center',marginBottom:'40px',marginTop:'40px'}}>
                <p>There are no Notifications for now!</p>
             </div>
            )
    }</>)}
    </>
    )}

    </>
 ):(<><p>Subscribe to receive notifications</p></>)
}
</>)}
export default Notifications;