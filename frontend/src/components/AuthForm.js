import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigate
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classes from './AuthForm.module.css';


const AuthForm=({onSubmit})=>{
const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

const navigate= useNavigate();

  const submitHandler = (data) => {
    onSubmit(data);
  };

   const resetHandler=()=>{
        console.log("in reset");
        navigate('/');
   };
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') === 'login';
  //const isSubmitting = navigation.state === 'submitting';
   return (
   <div className={classes.container}>
     <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>

        <h1>{isLogin ? 'Sign in' : 'Create a new user'}</h1>

          {!isLogin &&
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
       </>
       }
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
           <input id="password" type="password" name="password"
           {...register("password", {
             required: "Password is required.",
             minLength: {
               value: 6,
               message: "Password should be at-least 6 characters."
             }
           })}
         />
          {errors.password && (
                     <p className="errorMsg">{errors.password.message}</p>)}

         </div>

          { !isLogin && <>
         <div className={classes.control}>
           <label htmlFor="confirm_password">Confirm Password</label>
           <input
             id="confirm_password"
             type="password"
             name="confirm_password"
              {...register("confirm_password", { required: "confirm_password is required." })}
           />
           {errors.confirm_password && (
                                <p className="errorMsg">{errors.confirm_password.message}</p>)}
         </div></>
         }






       <div className={classes.actions}>
         <button type="reset" onClick={resetHandler} className="button button-flat">
           Cancel
         </button>
         <button  type="submit" className={classes.button} disabled={isSubmitting}>
           {isSubmitting? 'Submitting': 'Proceed'}
         </button>
        </div>
       <div className={classes.actions} >
       <Link to={`?mode=${isLogin ? 'signup' : 'login'}`} >
           {isLogin ? 'Create new user' : 'Already registered? Login'}
           </Link>
       </div>
       </>
     </form>
    </div>
   );

}
export default AuthForm;