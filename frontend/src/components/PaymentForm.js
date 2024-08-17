import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigate
} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useContext} from 'react';
import {OrderContext} from '../Context/order-context';
import {AuthContext} from '../Context/auth-context';
import classes from './paymentform.module.css';
import Modal from './Modal';


const PaymentForm=({onSubmit})=>{
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
      } = useForm();

const navigate= useNavigate();
const {item, clearContext,orderId, orders}=useContext(OrderContext);
const {isLoggedIn, userId, token}=useContext(AuthContext);


  const submitHandler = (data) => {
    onSubmit(data);
  };

   const resetHandler=async()=>{

        const index = orders.findIndex(order => order === orderId);
        if (index !== -1) {
          orders.splice(index, 1);
        }

       const response=await fetch('http://localhost:5000/orders/deleteOrder',{
       method:'PUT',
                   headers:{
                           'Authorization': `Bearer ${token}`,
                           'content-type':'application/json'},

                   body:JSON.stringify({id:orderId})
       });

       clearContext();

        navigate(-1);
   };
   return (
   <div className={classes.container}>
     <form  onSubmit={handleSubmit(submitHandler)} className={classes.form}>
    <table><tbody  className={classes.control}>
         <tr>
           <td><label className={classes.label} htmlFor="name">Name</label></td>
           <td><input type="text" id="name" name="name"
              {...register("name", { required: "Name is required." })}  /></td></tr>
  {errors.name && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.name.message}</p></td></tr>}

        <tr><td><label htmlFor="email">Email</label></td>
           <td><input id="email" type="text" name="email"
         {...register("email", {
               required: "Email is required.",
               pattern: {
                 value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                 message: "Email is not valid."}})}/></td></tr>
         {errors.email && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.email.message}</p></td></tr>}

        <tr><td><label htmlFor="phone">Mobile</label></td>
            <td><input id="phone" type="text" name="phone"
         {...register("phone", {
               required: "Mobile number is required."})}/></td></tr>
         {errors.phone &&  <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.phone.message}</p></td></tr>}
        <tr >
        <td><label className={classes.label} htmlFor="pincode">Pincode</label></td>
         <td><input type="text" id="pincode" name="pincode"
          {...register("pincode", { required: "Pin code is required." })}  /></td></tr>
          {errors.pincode && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.pincode.message}</p></td></tr>}

          <tr >
           <td><label htmlFor="address">Address</label></td>
           <td >
             <input className={classes.addressRow} type="text" id="address1" name="address1" {...register("address.0",{ required: "Enter atleast one address field." })} />
             <input className={classes.addressRow} type="text" id="address2" name="address2" {...register("address.1")} />
             <input  type="text" id="address3" name="address" {...register("address.2")} />
           </td>
         </tr>
         {errors.address && (
           <tr>
             <td></td>
             <td colspan="2">
               <p className={classes.errorMsg}>{errors.address.message}</p>
             </td>
           </tr>
         )}

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