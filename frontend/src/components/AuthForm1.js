import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classes from './AuthForm.module.css';


const AuthForm=()=>{
const data = useActionData();
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') === 'login';
  const isSubmitting = navigation.state === 'submitting';
   return (
     <Form method="POST" className={classes.form}>

        <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
         {data && data.errors && (
           <ul>
             {Object.values(data.errors).map((err) => (
               <li key={err}>{err}</li>
             ))}
           </ul>
         )}
         {data && data.message && <p>{data.message}</p>}
          {!isLogin && <>
        <div className="control-row">
         <div className="control">
           <label htmlFor="first_name">First Name</label>
           <input type="text" id="first_name" name="first_name" required/>
         </div>

         <div className="control">
           <label htmlFor="last_name">Last Name</label>
           <input type="text" id="last_name" name="last_name" />
         </div>
       </div></>}
       <div className="control">
         <label htmlFor="email">Email</label>
         <input id="email" type="email" name="email" required/>
       </div>

       <div className="control-row">
         <div className="control">
           <label htmlFor="password">Password</label>
           <input id="password" type="password" name="password" required minLength={6}/>
         </div>

          {!isLogin && <>
         <div className="control">
           <label htmlFor="confirm_password">Confirm Password</label>
           <input
             id="confirm_password"
             type="password"
             name="confirm_password" required
           />
         </div></>}
       </div>





       <div className={classes.action}>
         <button className="button button-flat">
           Cancel
         </button>
         <button  className="button" disabled={isSubmitting}>
           {isSubmitting? 'Submitting': 'Proceed'}
         </button>
        </div>
       <div className={classes.action} >
       <Link to={`?mode=${isLogin ? 'signup' : 'login'}`} >
           {isLogin ? 'Create new user' : 'Already registered? Login'}
           </Link>
       </div>
     </Form>
   );
 }

export default AuthForm;