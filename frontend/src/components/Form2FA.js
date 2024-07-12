import {useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import classes from './Form2FA.module.css';
import Modal from './Modal';
import {useNavigate} from 'react-router-dom';

const Form2FA=()=>{
const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();
    const modal=useRef();
    const navigate=useNavigate();

useEffect(() => {
    if (modal.current) {
      modal.current.open();
    }
  }, []);

const submitHandler = async(data) => {
    console.log(data.email);
    try{
    const response=await fetch('http://localhost:5000/2fa/send-2fa',{
                    method:'POST',
                    headers:{'content-type':'application/json'},
                    body:JSON.stringify({email:data.email})
                    });

        if(!response){
            throw new Error("unable to authenticate");
            return;
        }
        const respData=await response.json();
        console.log(respData.message);
    }
    catch(error){
    }
}

function handleReset(){
    modal.current.close();
    navigate(-1);
}

return(
<Modal ref={modal} onReset={handleReset}>
     <form  onSubmit={handleSubmit(submitHandler)} className={classes.form}>
         <div className={classes.control}>
             <label style={{width:'50px'}} htmlFor="email">Email</label>
             <input id="email" type="email" name="email"
             {...register("email", {
                   required: "Email is required.",
                   pattern: {
                     value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                     message: "Email is not valid."}})}/>
         </div>
         {errors.email && <div><p className={classes.errorMsg}>{errors.email.message}</p></div>}

         <div  className={classes.actions}><button>OK</button></div>
    </form>
    </Modal>
    )
}
export default Form2FA;