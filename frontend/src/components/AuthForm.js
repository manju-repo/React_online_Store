import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigate
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classes from './AuthForm.module.css';
import {useState, useEffect} from 'react';

const AuthForm=({onSubmit})=>{
    const [userRole,setUserRole]=useState('client');
    const [imageName, setImageName] = useState('Choose Image...');
    const [showPassword, setShowPassword] =useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =useState(false);

const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

const navigate= useNavigate();

  const submitHandler = (data) => {
    data.user_type=userRole;
    const submitHandler = (data) => {
        data.user_type = userRole;

        // Convert the form data to FormData to handle file upload
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'profileImage') {
            formData.append(key, data[key][0]); // Append the file
          } else if (Array.isArray(data[key])) {
            data[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, data[key]);
          }
        });

        onSubmit(formData);
      };
    onSubmit(data);
  };

  useEffect(() => {
    reset({ password: '',confirm_password:'' });
  }, [userRole, reset]);

   const resetHandler=()=>{
        console.log("in reset");
        navigate('/');
   };

   const handleRole=(role,event)=>{
   event.preventDefault();
       setUserRole(role);
  };
 const handleFileChange = (event) => {
    setImageName(event.target.files[0].name);
    console.log(event.target.files[0].name);
  };

  const showPasswordHandler=()=>{
    setShowPassword(prevState => !prevState);
  }

  const showConfirmPasswordHandler=()=>{
    setShowConfirmPassword(prevState => !prevState);
  }
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') === 'login';

   return (
<div className={`${classes.container} ${!isLogin && userRole === 'admin' ? classes.container1 : ''}`}>
     <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>

        <h3 style={{textAlign:'center',color:'#850e57'}}>{isLogin ? 'Sign in' : ''}</h3>
        {isLogin?(
        <>
               <div className={classes.control}>
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
                   <input id="password" type={showPassword ?"text": "password"} name="password"
                   {...register("password", {
                     required: "Password is required.",
                     minLength: {
                       value: 6,
                       message: "Password should be at-least 6 characters."
                     }
                   })}
                 />
                 <span style={{width:'20px'}}><i onClick={showPasswordHandler} class="fa-solid fa-eye"></i></span>
                  {errors.password && (<p className="errorMsg">{errors.password.message}</p>)}
                 </div>
            </>
            ):(
<>
        <h3 style={{color:'#850e57'}}>Sign up as <a style={{color:'#850e57'}} href="#" onClick={(event)=>handleRole('client',event)}>Customer</a> or <a style={{color:'#850e57'}} href="#" onClick={(event)=>handleRole('admin',event)}>Seller</a></h3>
         {(userRole==='client')?(
            <>
         <div className={classes.control}>
           <label htmlFor="first_name">First Name</label>
           <input type="text" id="first_name" name="first_name"
              {...register("first_name", { required: "First name is required." })}  />
          {errors.first_name && <p className="errorMsg">{errors.first_name.message}</p>}
         </div>

         <div className={classes.control}>
           <label htmlFor="last_name">Last Name</label>
           <input type="text" id="last_name" name="last_name"
             {...register("last_name", { required: "Last name is required." })}  />
          {errors.last_name && <p className="errorMsg">{errors.last_name.message}</p>}
         </div>

        <div className={classes.control}>
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
           <input id="password" type={showPassword ?"text": "password"} name="password"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password should be at-least 6 characters."
            }
          })}
        />
         <span style={{width:'20px'}}><i onClick={showPasswordHandler} class="fa-solid fa-eye"></i></span>
         {errors.password && (<p className="errorMsg">{errors.password.message}</p>)}
        </div>

         <div className={classes.control}>
           <label htmlFor="confirm_password">Confirm Password</label>
           <input id="confirm_password" type={showConfirmPassword ?"text": "password"} name="confirm_password"
              {...register("confirm_password", { required: "confirm_password is required." })}
           />

           <span style={{width:'20px'}}><i onClick={showConfirmPasswordHandler} class="fa-solid fa-eye"></i></span>
           {errors.confirm_password && (<p className="errorMsg">{errors.confirm_password.message}</p>)}
         </div>
         <div className={classes.control}>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              name="phone"
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
            <label htmlFor="first_name">First Name</label>
            <input type="text" id="first_name" name="first_name"
               {...register("first_name", { required: "First name is required." })}  />
           {errors.first_name && <p className="errorMsg">{errors.first_name.message}</p>}
          </div>

          <div className={classes.control}>
            <label htmlFor="last_name">Last Name</label>
            <input type="text" id="last_name" name="last_name"
              {...register("last_name", { required: "Last name is required." })}  />
           {errors.last_name && <p className="errorMsg">{errors.last_name.message}</p>}
          </div>

        <div className={classes.control}>
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
           <input id="password" type={showPassword ?"text": "password"} name="password"
           {...register("password", {
             required: "Password is required.",
             minLength: {
               value: 6,
               message: "Password should be at-least 6 characters."
             }
           })}
         />
         <span style={{width:'20px'}}><i onClick={showPasswordHandler} class="fa-solid fa-eye"></i></span>
          {errors.password && (<p className="errorMsg">{errors.password.message}</p>)}
         </div>

          <div className={classes.control}>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input id="confirm_password" type={showConfirmPassword ?"text": "password"} name="confirm_password"
               {...register("confirm_password", { required: "confirm_password is required." })}
            />
         <span style={{width:'20px'}}><i onClick={showConfirmPasswordHandler} class="fa-solid fa-eye"></i></span>
            {errors.confirm_password && (<p className="errorMsg">{errors.confirm_password.message}</p>)}
          </div>
          <div className={classes.control}>
             <label htmlFor="phone">Phone</label>
             <input
               id="phone"
               type="text"
               name="phone"
                {...register("phone", { required: "Phone Number is required." })}
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
                    onChange={handleFileChange} style={{ display: 'none' }}/>

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
                 {...register("bus_subcategory", { required: "Please enter your Business Sub-category" })}
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
            <label htmlFor="acc_holder_name">Account Holder Name</label>
            <input
              id="acc_holder_name"
              type="text"
              name="acc_holder_name"
               {...register("acc_holder_name", { required: "Enter Account Holder Name" })}
            />
            {errors.acc_holder_name && (
                 <p className="errorMsg">{errors.acc_holder_name.message}</p>)}
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
      </>
     )
         }




       <div style={{marginTop:'20px'}}>
         <button className={classes.button} type="reset" onClick={resetHandler}>
           Cancel
         </button>
         <button className={classes.button} type="submit" >
           {isSubmitting? 'Submitting': 'Proceed'}
         </button>
        </div>
       <div style={{marginTop:'20px'}}>
       <Link style={{color:'#850e57',textDecoration:'none'}} to={`?mode=${isLogin ? 'signup' : 'login'}`} >
           {isLogin ? 'Create new user' : 'Already registered? Login'}
       </Link>
       </div>

     </form>
    </div>

   );

}
export default AuthForm;