import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigate
} from 'react-router-dom';
import { useForm,setValue } from 'react-hook-form';
import classes from './ProfileForm.module.css';
import {useState, useEffect, useContext} from 'react';
import {AuthContext} from '../Context/auth-context';

const ProfileForm=({onAvatarChange})=>{
  const [userRole,setUserRole]=useState('client');
  const {userId, isAdmin}=useContext(AuthContext);
  const [imageName, setImageName] = useState('Choose Image...');
  const [userDetails,setUserDetails] =useState(null);
const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,setValue
  } = useForm();

const navigate= useNavigate();

useEffect(()=>{

    const getData=async()=>{
    try{
        let profileImage;
         const response=await fetch(`http://localhost:5000/user/${userId}`);
          if (!response){
             throw new Error('Updating User failed');
          }
         const respData=await response.json();
         if(respData){
           const loggedUser= respData.user;
           console.log(loggedUser);
           setUserDetails(loggedUser);
           setImageName(loggedUser.profileImage);

           reset({
                   name: loggedUser.name,
                   phone: loggedUser.phone,
                   profileImage: loggedUser.profileImage,
                   address: loggedUser.address || ['', '', ''], // Handle address array
                   bus_name:loggedUser.bus_name,
                   bus_type:loggedUser.bus_type,
                   bus_category:loggedUser.bus_category,
                   bus_subcategory:loggedUser.bus_subcategory,
                   pan:loggedUser.pan,
                   gstin:loggedUser.gstin,
                   account_number:loggedUser.account_number,
                   account_holder_name:loggedUser.account_holder_name,
                   ifsc_code:loggedUser.ifsc_code
                 });
 // Set the image name if there's a profile image
         if (loggedUser.profileImage) {
           const imageNameFromPath = loggedUser.profileImage.split('/').pop(); // Extract the file name from the path
           setImageName(imageNameFromPath);
         }
         }
     }
    catch(error){
        console.log(error);
    }
    }
    getData();
},[userId]);

const submitHandler = async (data) => {
  data.user_type = userRole;

  const formData = new FormData();

  // Append text fields
  Object.keys(data).forEach((key) => {
  if (key !== 'profileImage') { // Exclude profileImage
    if (Array.isArray(data[key])) {
      data[key].forEach((value, index) => {
        formData.append(`${key}[${index}]`, value);
      });
    } else {
      formData.append(key, data[key]);
    }
  }
 } );

  // Append file data
if(data.profileImage) console.log(data.profileImage);
   if (data.profileImage)
      formData.append('profileImage',data.profileImage);
  else{
    const nameParts = data.name?.split(' ') || [];
    const initials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
      : `${nameParts[0][0] || ''}`;
    console.log(initials);
      formData.append('profileImage', initials || 'NO_IMAGE');
  }

console.log(formData);
  try {
    const response = await fetch(`http://localhost:5000/user/${userId}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    // Handle the response, e.g., navigate or display a success message
   const responseData = await response.json();
console.log(responseData?.user?.profileImage);


         if (responseData?.user?.profileImage) {
           const newAvatar = responseData.user.profileImage; // Assuming your response contains the updated avatar URL
           console.log(newAvatar);
           onAvatarChange(newAvatar);
         }
alert("Details updated!");
  } catch (error) {
    console.error(error);
  }
};

   const resetHandler=()=>{
        console.log("in reset");
        navigate('/');
   };


const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setImageName(file.name);
    // Directly set file value if using react-hook-form
    setValue('profileImage', file);
  }
};

const handleClearFile = () => {
  setImageName('Choose Image...'); // Reset to default text
  setValue('profileImage', null); // Clear the file value in react-hook-form
  document.getElementById('profileImage').value = ''; // Clear the file input field
};


   return (
<div className={`${classes.container} ${isAdmin ? classes.container1 : ''}`}>
     <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>


         {!isAdmin?(
            <>
         <div className={classes.control}>
           <label htmlFor="name">Name</label>
           <input type="text" id="name" name="name"
              {...register("name", { required: "Name is required." })}  />
          {errors.name && <p className="errorMsg">{errors.name.message}</p>}
         </div>


         <div className={classes.control}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              name="phone" defaultValue={userDetails?.phone}
               {...register("phone", { required: "Phone Number is required.",
                minLength: {
                              value: 10,
                              message: "Please enter a valid 10-digit phone number"
                            },
                maxLength: {
                              value: 10,
                              message: "Please enter a valid 10-digit phone number"
                            }
                            })}
            />
            {errors.phone && (
                 <p className="errorMsg">{errors.phone.message}</p>)}
          </div>

          <div className={classes.control}>
                <label htmlFor="profileImage">Profile Image</label>
                <label for="profileImage" className={classes.custom_file_upload}>
                    {imageName}
                  </label>

                <input id="profileImage" type="file" name="profileImage"  accept="image/*" {...register("profileImage")}
                    onChange={(event) => {
                        register("profileImage").onChange(event);  // Call the default onChange from register
                        handleFileChange(event);  // Handle updating the file name state
                      }}
                    style={{ display: 'none' }}/>
              <button type="button" className={classes.clear_button} id="clearButton" onClick={handleClearFile}>X</button>
          </div>

          <div className={classes.control}>
            <label style={{minWidth:'240px'}} htmlFor="address">Address</label>
            <div style={{textAlign:'left'}}>
                  <input  type="text" id="address1" name="address1" {...register("address.0",{ required: "Enter atleast one address field." })} />
                   <input type="text" id="address2" name="address2" {...register("address.1")} />
                   <input type="text" id="address3" name="address" {...register("address.2")} />
                   <div>  {errors.address && (<p className="errorMsg">{errors.address.message}</p>)}</div>
          </div>
          </div>
          </>
         ):(
         <>
         <fieldset><legend style={{color:'#850e57'}} >Personal Details</legend>
         <div className={classes.control}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name"
               {...register("name", { required: "Name is required." })}  />
           {errors.name && <p className="errorMsg">{errors.name.message}</p>}
          </div>


        {/*<div className={classes.control}>
             <label htmlFor="email">Email</label>
             <input id="email" type="email" name="email"
             {...register("email", {
                   required: "Email is required.",
                   pattern: {
                     value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                     message: "Email is not valid."
                   }
                 })}
               />
             {errors.email && <p className="errorMsg">{errors.email.message}</p>}
           </div>

         <div className={classes.control}>
           <label htmlFor="password">Password</label>
           <input id="password" type="password" name="password"
           {...register("password", {
             required: "Password is required.",
             minLength: {
               value: 6,
               message: "Password should be at-least 6 characters."
             }
           })}
         />
          {errors.password && (<p className="errorMsg">{errors.password.message}</p>)}
         </div>

          <div className={classes.control}>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              id="confirm_password"
              type="password"
              name="confirm_password"
               {...register("confirm_password", { required: "confirm_password is required." })}
            />
            {errors.confirm_password && (<p className="errorMsg">{errors.confirm_password.message}</p>)}
          </div>*/}

          <div className={classes.control}>
             <label htmlFor="phone">Phone</label>
             <input
               id="phone"
               type="text"
               name="phone"
                {...register("phone", { required: "Phone Number is required.",
                 pattern: {
                         value: /^[0-9]{10}$/, // Regular expression for exactly 10 digits
                         message: "Phone Number must be exactly 10 digits long.",
                       },
                 })}
             />
             {errors.phone && (
                  <p className="errorMsg">{errors.phone.message}</p>)}
           </div>

           <div className={classes.control}>
                           <label htmlFor="profileImage">Profile Image</label>
                           <label for="profileImage" className={classes.custom_file_upload}>
                               {imageName}
                             </label>

                           <input id="profileImage" type="file" name="profileImage"  accept="image/*" {...register("profileImage")}
                               onChange={(event) => {
                                   register("profileImage").onChange(event);  // Call the default onChange from register
                                   handleFileChange(event);  // Handle updating the file name state
                                 }}
                               style={{ display: 'none' }}/>
                         <button type="button" className={classes.clear_button} id="clearButton" onClick={handleClearFile}>X</button>
                     </div>
    </fieldset>
    <fieldset>
    <legend style={{color:'#850e57'}} >Business Details</legend>
        <div className={classes.control}>
           <label htmlFor="bus_name">Business Name</label>
           <input
             id="bus_name"
             type="text"
             name="bus_name"
              {...register("bus_name", { required: "Please enter your Business Name" })}
           />
           {errors.bus_name && (
                <p className="errorMsg">{errors.bus_name.message}</p>)}
         </div>
        <div className={classes.control}>
           <label htmlFor="bus_type">Business Type</label>
           <input
             id="bus_type"
             type="text"
             name="bus_type"
              {...register("bus_type", { required: "Please enter your Business Type" })}
           />
           {errors.bus_type && (
                <p className="errorMsg">{errors.bus_type.message}</p>)}
         </div>
         <div className={classes.control}>
            <label htmlFor="bus_category">Business Category</label>
            <input
              id="bus_category"
              type="text"
              name="bus_category"
               {...register("bus_category", { required: "Please enter your Business category" })}
            />
            {errors.bus_category && (
                 <p className="errorMsg">{errors.bus_category.message}</p>)}
          </div>
          <div className={classes.control}>
              <label htmlFor="bus_subcategory">Business Sub-Category</label>
              <input
                id="bus_subcategory"
                type="text"
                name="bus_subcategory"
                 {...register("bus_subcategory")}
              />
              {errors.bus_subcategory && (
                   <p className="errorMsg">{errors.bus_subcategory.message}</p>)}
            </div>
             <div className={classes.control}>
              <label htmlFor="pan">PAN</label>
              <input
                id="pan"
                type="text"
                name="pan"
                 {...register("pan", { required: "Please enter your PAN" })}
              />
              {errors.pan && (
                   <p className="errorMsg">{errors.pan.message}</p>)}
            </div>
            <div className={classes.control}>
              <label htmlFor="gstin">GSTIN</label>
              <input
                id="gstin"
                type="text"
                name="gstin"
                 {...register("gstin", { required: "Please enter your GSTIN" })}/>
              {errors.pan && (
                   <p className="errorMsg">{errors.gstin.message}</p>)}
            </div>

            <div className={classes.control}>
            <label style={{minWidth:'240px'}} htmlFor="address">Address</label>
            <div style={{textAlign:'left'}}>
                  <input  type="text" id="address1" name="address1" {...register("address.0",{ required: "Enter atleast one address field." })} />
                   <input type="text" id="address2" name="address2" {...register("address.1")} />
                   <input type="text" id="address3" name="address" {...register("address.2")} />
                   <div>  {errors.address && (<p className="errorMsg">{errors.address.message}</p>)}</div>
          </div>
          </div>
    </fieldset>
    <fieldset><legend style={{color:'#850e57'}} >Bank Account Details</legend>
         <div className={classes.control}>
           <label htmlFor="account_number">Account Number</label>
           <input
             id="account_number"
             type="text"
             name="account_number"
              {...register("account_number", { required: "Account Number is required." })}
           />
           {errors.account_number && (
                <p className="errorMsg">{errors.account_number.message}</p>)}
         </div>

         <div className={classes.control}>
            <label htmlFor="account_holder_name">Account Holder Name</label>
            <input
              id="account_holder_name"
              type="text"
              name="account_holder_name"
               {...register("account_holder_name", { required: "Enter Account Holder Name" })}
            />
            {errors.account_holder_name && (
                 <p className="errorMsg">{errors.account_holder_name.message}</p>)}
          </div>

          <div className={classes.control}>
              <label htmlFor="ifsc_code">IFSC Code</label>
              <input
                id="ifsc_code"
                type="text"
                name="ifsc_code"
                 {...register("ifsc_code", { required: "Enter IFSC Code" })}
              />
              {errors.ifsc_code && (
                   <p className="errorMsg">{errors.ifsc_code.message}</p>)}
            </div>
      </fieldset>
      </>
      )}






       <div style={{marginTop:'20px'}}>
         <button className={classes.button} type="reset" onClick={resetHandler}>
           Cancel
         </button>
         <button className={classes.button} type="submit" >Proceed</button>
        </div>

     </form>
    </div>

   );
}
export default ProfileForm;