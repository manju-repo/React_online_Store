import {useNavigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useContext} from 'react';
import classes from './paymentform.module.css';


const FabricForm=({onSubmit})=>{
const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

const navigate= useNavigate();
const orderCtx=useContext(OrderContext);
  const submitHandler = (data) => {
    onSubmit(data);
  };

   const resetHandler=()=>{
        console.log("in reset");
        navigate('/fabrics/'+orderCtx.item.id);
   };
   return (
   <div className={classes.container}>
     <form  onSubmit={handleSubmit(submitHandler)} className={classes.form}>
    <table><tbody  className={classes.control}>
         <tr >
           <td><label className={classes.label} htmlFor="first_name">First Name</label></td>
           <td><input type="text" id="first_name" name="first_name"
              {...register("first_name", { required: "First name is required." })}  /></td></tr>
  {errors.first_name && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.first_name.message}</p></td></tr>}

        <tr>
           <td><label htmlFor="last_name">Last Name</label></td>
           <td><input type="text" id="last_name" name="last_name"
             {...register("last_name")}  /></td></tr>
  {errors.last_name && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.last_name.message}</p></td></tr>}

        <tr><td><label htmlFor="email">Email</label></td>
           <td><input id="email" type="email" name="email"
         {...register("email", {
               required: "Email is required.",
               pattern: {
                 value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                 message: "Email is not valid."}})}/></td></tr>
         {errors.email && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.email.message}</p></td></tr>}

        <tr><td><label htmlFor="phone">Mobile</label></td>
            <td><input id="phone" type="phone" name="phone"
         {...register("phone", {
               required: "Mobile number is required."})}/></td></tr>
         {errors.phone &&  <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.phone.message}</p></td></tr>}
    </tbody>
    </table>
        <div className={classes.action}>
         <button type="reset" onClick={resetHandler} className="button button-flat">
           Cancel
         </button>
         <button  type="submit" className="button" disabled={isSubmitting}>
            Pay Now
         </button>
        </div>
     </form>
    </div>
   );

}
export default PaymentForm;

return <h2>Fabric Details</h2>}
export default FabricForm;