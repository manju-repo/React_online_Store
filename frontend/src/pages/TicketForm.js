import {Form, useNavigate, useLocation, useParams} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classes from './TicketForm.module.css';
import {useState, useContext, useEffect} from 'react';
import {AuthContext} from '../Context/auth-context';
import moment from 'moment';

const TicketForm=()=>{
    const { ticketId } = useParams();
    const location = useLocation();
    const [ticketDetails,setTicketDetails] =useState(null);
    const [isReplying, setIsReplying] = useState(false); // State to track if replying

// Check if the route is for creating a new ticket
    const isNewTicket = location.pathname === '/ticket/new';

    const navigate= useNavigate();
    const {token, isLoggedIn, isAdmin, superAdmin, userId}=useContext(AuthContext);

    useEffect(()=>{
    const getTicket=async()=>{
        try{
             const response=await fetch(`http://localhost:5000/tickets/${ticketId}`,{
                   method:'GET',
                   headers:{
                       'Content-Type':'application/json',
                        'Authorization':'Bearer '+ token}
                   });
              if (!response){
                 throw new Error('Updating User failed');
              }
             const {ticket}=await response.json();
             console.log(ticket);
             setTicketDetails(ticket);
         }
         catch(error){
            console.log(error);
         }
     }
     getTicket();
     if(ticketDetails) console.log(ticketDetails);
    },[ticketId,location]);

    const resetHandler=()=>{
        navigate('/tickets');
   };

   const validateData=(data)=>{
       if(!data.description){
            alert("Please enter Description to continue");
            return;
       }
   }

   const replyHandler=()=>{
    setIsReplying(true); // Show textarea for reply

   }

   const submitHandler=async(data)=>{
    validateData(data);
    const currentDate = new Date().toISOString();
    console.log(data, currentDate);
    const {subject, description}=data;
    const sender=isAdmin?'admin':'client';
    const message={text:description, timeStamp:currentDate, sender:sender}
    try{
        let response;
        if(isNewTicket){
             response=await fetch('http://localhost:5000/tickets',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                     'Authorization':'Bearer '+ token},
                 body:JSON.stringify({subject:subject, message:message})
                });
        }
        else{
             response=await fetch(`http://localhost:5000/tickets/${ticketId}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                     'Authorization':'Bearer '+ token},
                 body:JSON.stringify({message:message})
                });
        }
            const {success}=await response.json();
            console.log(success);

            if(!success){
                alert("Ticket creation failed.. Please try again");
                return;
            }
            navigate('/tickets');
        }
        catch(error){
            console.log(error);
        }
    };

   const {
       register,
       handleSubmit,
       formState: { errors, isSubmitting },
       reset
     } = useForm();

return(
     <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
     {isNewTicket ? (<>
        <div className={classes.fields}>
        <label htmlFor="subject">Subject</label>
        <input id="subject" type="text" name="subject"
        {...register("subject", {
              required: "Subject is required.",

            })}
          />
        {errors.subject && <p className="errorMsg">{errors.subject.message}</p>}
      </div>


      <div className={classes.fields}>
        <label htmlFor="description">{isNewTicket?'Description':'Reply'}</label>
        <textarea id="description" name="description" rows="10"
        {...register("description", {
              required: "Description is required.",

            })}
          />
        {errors.description && <p className="errorMsg">{errors.description.message}</p>}
      </div>
      <div style={{marginTop:'20px'}}>
       <button className={classes.button} type="reset" onClick={resetHandler}>
         Cancel
       </button>
       <button className={classes.button} type="submit" >
         {isSubmitting? 'Submitting': 'Proceed'}
       </button>
      </div></>
      ):(
       ticketDetails ? (
     <div>
       <div style={{ fontWeight: 'bold' }}>Subject: {ticketDetails.subject}</div>
       {
         ticketDetails.message.map((message, index) => (
           <div key={index} style={{ marginBottom: '20px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
               <div style={{ textAlign: 'left', marginLeft: '100px', width: '300px' }}>From {message.sender}</div>
               <div style={{ textAlign: 'left', marginRight: '100px' }}>{moment(message.timeStamp).format('MMMM D, YYYY h:mm:ss A')}</div>
             </div>
             <div style={{
               marginLeft: '100px',
               marginRight: '100px',
               textAlign:'left',
               padding: '10px',
               border: '1px solid #ccc',
               borderRadius: '5px',
               maxWidth: '600px',
               whiteSpace: 'pre-wrap', // Ensures proper line wrapping
               wordWrap: 'break-word', // Breaks long words to fit within the container
             }}>
               {message.text}
             </div>
           </div>
         ))
       }
       {!isReplying ? (
         <div style={{ marginTop: '20px' }}>
           <button className={classes.button} type="button" onClick={replyHandler}>
             Reply
           </button>
         </div>
       ) : (<>
         <div className={classes.fields} style={{ marginTop: '20px', marginLeft: '100px', width: '600px' }}>
           <label style={{ marginBottom: '10px' }} htmlFor="description">Reply</label>
           <textarea
             id="description"
             name="description"
             rows="10"
             {...register('description', { required: 'Reply is required.' })}
             style={{ width: '100%' }} // Full width of the container
           />
           {errors.description && <p className="errorMsg">{errors.description.message}</p>}
         </div>

         <div style={{ marginTop: '20px' }}>
           <button className={classes.button} type="button" onClick={resetHandler}>
             Cancel
           </button>
           <button className={classes.button} type="submit">
             {isSubmitting ? 'Submitting' : 'Send'}
           </button>
         </div>
         </>
       )}
     </div>


      ):(<p>Could not load Ticket</p>)
      )
      }
  </form>);
}
export default TicketForm;