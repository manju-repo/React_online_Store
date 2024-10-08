import {useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {uiActions} from '../Store/ui_slice';
import {NavLink, useNavigate} from 'react-router-dom';
import  '@fortawesome/fontawesome-free/css/all.css';
import {AuthContext} from '../Context/auth-context';
import classes from './ticket.module.css';
import moment from 'moment';

const Ticket=()=> {
    const {token, isLoggedIn, isAdmin, superAdmin}=useContext(AuthContext);
    const navigate=useNavigate();
    const [tickets,setTickets] =useState(null);


useEffect(()=>{
    const fetchTickets=async()=>{
    try{
        let response;
        if(isAdmin)
             response=await fetch('http://localhost:5000/tickets/admin',{
               method:'GET',
               headers:{
                   'Content-Type':'application/json',
                    'Authorization':'Bearer '+ token}
               });
        else
             response=await fetch('http://localhost:5000/tickets',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                     'Authorization':'Bearer '+ token}
                });

        console.log(response);
        const {tickets}=await response.json();
        console.log(tickets);
        if(tickets)
            setTickets(tickets);
    }
    catch(error){
        console.log(error);
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


   fetchTickets();
},[]);

const addTicketHandler = () => {
       navigate(`/ticket/new`);
   }

 const removeEntryHandler = (event) => {
  event.preventDefault(); // Prevent the default anchor tag behavior
   event.stopPropagation(); // Stop the click from propagating to the NavLink
    alert('remove');
    return;
 }
  return (<>

{
isLoggedIn && !isAdmin && (
    <div style={{textAlign:'center',marginBottom:'40px',marginTop:'40px'}}>
    <button onClick={addTicketHandler} className={classes.button} >Raise a Ticket</button>
    </div>)
}
<ul>
  {tickets && tickets.map((ticket) => (

     <li key={ticket._id}>
        <NavLink style={{textDecoration:'none'}} to={{pathname:`/ticket/edit/${ticket._id}` }}  className={classes.ticket}>
            <div style={{minWidth:'250px'}}>{moment(ticket.message[ticket.message.length-1].timeStamp).format('MMMM D, YYYY h:mm:ss A')}</div>
            <div style={{minWidth:'500px',marginLeft:'100px',textAlign:'left'}}>{ticket.subject}</div>
            <div style={{minWidth:'100px'}}>{ticket.status}</div>
            <div style={{minWidth:'200px'}}>From {ticket.message[ticket.message.length-1].sender}</div>
        </NavLink>
      </li>))}
</ul>

</>)
}
export default Ticket;
