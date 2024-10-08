import {Form, useNavigate, useLocation, useParams} from 'react-router-dom';
import { useForm, setValue } from 'react-hook-form';
import classes from './NotificationForm.module.css';
import {useState, useContext, useEffect} from 'react';
import {AuthContext} from '../Context/auth-context';
import moment from 'moment';

const NotificationForm=()=>{
    const { notificationId } = useParams();
    const location = useLocation();
    const [notificationDetails,setNotificationDetails] =useState(null);
// Check if the route is for creating a new ticket
    const isNewNotification = location.pathname === '/notifications/new';
console.log(notificationId);
    const navigate= useNavigate();
    const {token, isLoggedIn, isAdmin, superAdmin, userId}=useContext(AuthContext);
    const [imageName, setImageName] = useState('Choose Image...');

    useEffect(()=>{
    const getNotification=async()=>{
        try{
             const response=await fetch(`http://localhost:5000/notifications/${notificationId}`,{
                   method:'GET',
                   headers:{
                       'Content-Type':'application/json',
                        'Authorization':'Bearer '+ token}
                   });

             const {notification}=await response.json();
             console.log(notification);
             if (notification) {
                setNotificationDetails(notification);
                 reset({
                    isGeneral: notification.isGeneral,
                    notificationMsg: notification.notificationMsg,
                    imageUrl: notification.imageUrl
                 });

                if (notification.imageUrl) {
                    const imageNameFromPath = notification.imageUrl.split('/').pop(); // Extract the file name from the path
                    console.log(imageNameFromPath);
                    setImageName(imageNameFromPath);
                }else{
                    setImageName('Choose Image...');
                }
             }
         }
         catch(error){
            console.log(error);
         }
     }
     getNotification();
     if(notificationDetails) console.log(notificationDetails);
    },[notificationId,location]);

    const resetHandler=()=>{
        navigate('/notifications');
   };

   /*const validateData=(data)=>{
       if(!data.description){
            alert("Please enter Description to continue");
            return;
       }
   }*/

   /*const replyHandler=()=>{
    setIsReplying(true); // Show textarea for reply

   }*/


   const {
       register,
       handleSubmit,
       formState: { errors, isSubmitting },
       reset,setValue
     } = useForm();

const submitHandler = async (data) => {
console.log(data.imageUrl);
  const formData = new FormData();

  // Append text fields
  /*Object.keys(data).forEach((key) => {
  if (key !== 'imageUrl') { // Exclude profileImage
    if (Array.isArray(data[key])) {
      data[key].forEach((value, index) => {
        formData.append(`${key}[${index}]`, value);
      });
    } else {
      formData.append(key, data[key]);
    }
  }
 } );*/

  // Append file data
if(data.imageUrl) console.log(data.imageUrl);
   if (data.imageUrl){
      formData.append('imageUrl',data.imageUrl);
  } else if (notificationDetails && notificationDetails.imageUrl) {
    // If no new file is selected, keep the existing image URL
    formData.append('imageUrl', notificationDetails.imageUrl);
  }
formData.append('isGeneral',data.isGeneral);
formData.append('notificationMsg', data.notificationMsg);
//console.log(formData);
  try {
   let response;
    if(isNewNotification){
         response=await fetch('http://localhost:5000/notifications',{
          method:'POST',
          headers:{'Authorization':'Bearer '+ token},
           body:formData,
          });
   }
   else{
          response = await fetch(`http://localhost:5000/notifications/${notificationId}`, {
          method: 'PUT',
          headers:{'Authorization':'Bearer '+ token},
          body: formData,
    });
   }
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    navigate('/notifications');
  }
  catch (error) {
    console.error(error);
  }
};



const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log(file.name);
    setImageName(file.name);
    // Directly set file value if using react-hook-form
    setValue('imageUrl', file);
  }
};

const handleClearFile = () => {
  setImageName('Choose Image...'); // Reset to default text
  setValue('imageUrl', null); // Clear the file value in react-hook-form
  document.getElementById('imageUrl').value = ''; // Clear the file input field
};

return(
     <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>

         <div className={classes.fields}>
         <label htmlFor="isGeneral">General Notification</label>
         <input
               type="checkbox"
               {...register("isGeneral")}
               id="isGeneral"
               style={{width:'50px'}}
         />
         </div>

        <div className={classes.fields}>
        <label htmlFor="notificationMsg">Notification Message</label>
        <textarea  style={{overflowY:'auto'}} id="notificationMsg" type="text" name="notificationMsg" rows="4"
        {...register("notificationMsg", {
              required: "Notification Message is required.",

            })}
          />
        {errors.notificationMsg && <p className="errorMsg">{errors.notificationMsg.message}</p>}
      </div>

    <div className={classes.fields}>
        <label htmlFor="imageUrl">Display Image</label>
        <label for="imageUrl" className={classes.custom_file_upload}>
            {imageName}
        </label>

        <input id="imageUrl" type="file" name="imageUrl"  accept="image/*" {...register("imageUrl")}
            onChange={(event) => {
                register("imageUrl").onChange(event);  // Call the default onChange from register
                handleFileChange(event);  // Handle updating the file name state
              }}
            style={{ display: 'none' }}/>

      <button type="button" className={classes.clear_button} id="clearButton" onClick={handleClearFile}>X</button>
      </div>
      <div style={{ marginTop: '40px',width:'80%' }}>
         <button className={classes.button} type="button" onClick={resetHandler}>
           Cancel
         </button>
         <button className={classes.button} type="submit">Send</button>
       </div>
  </form>);
}
export default NotificationForm;