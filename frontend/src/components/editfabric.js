import {useNavigate} from 'react-router-dom';
import {useContext, useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import classes from './fabricform.module.css';
import {AuthContext} from '../Context/auth-context';


const EditFabricForm=(props)=>{
const navigate= useNavigate();
const authCtx=useContext(AuthContext);
let {mode,item}=props;
console.log(mode, item);

if (mode!=='edit') mode='add';

//const {item}=props;
const category = [
  { value: "Fabrics", label: "Fabrics" },
  { value: "Sarees", label: "Sarees" },
  { value: "Lehengas", label: "Lehengas" },
  { value: "Salwar Suits", label: "Salwar Suits" },
  { value: "Dupattas", label: "Dupattas" },
  { value: "Shrugs", label: "Shrugs" }

];

const [CategoryIndex,setCategoryIndex]=useState(0);
const [FormErrors,setFormErrors]=useState([]);
useEffect(() => {
    if (mode === 'edit') {
       /* const index = category.findIndex(cat => cat.value === item.category);
        if (index !== -1) {
            setCategoryIndex(index);
        }*/
    let defaultValues={};
    defaultValues.category=category[0];
    defaultValues.sub_category=item.sub_category;
    defaultValues.type=item.type;
    reset({...defaultValues});

    }
}, []);

const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();



  const submitHandler =async (data) => {
  console.log(mode);
  alert(mode);
  if(mode==='edit'){

      const category=data.category.value;
      alert(data.sub_category);
      if(data.sub_category===null){
        errors.push("Sub-category is required");
        alert("Sub-category is required");
      }
      const sub_category=data.sub_category;

      const type=data.type;
      const imageurl=data.imageurl;
      const desc=data.desc;
      const price=data.price;
      console.log(category, sub_category, type, price, imageurl, desc);
     if(sub_category===null)
      try{
        const response = await fetch(`http://localhost:5000/fabrics/${item.id}`,{
                        method:'PUT',
                        headers:{'content-type':'application/json',Authorization:'Bearer '+ authCtx.token},
                        body:JSON.stringify({category:category, sub_category:sub_category, type:type, image:imageurl, desc:desc, price:price})
                        });
        console.log(response);
        const respdata=await response.json();
        console.log(respdata);
        alert(respdata.message);
        navigate('/fabrics');
      }
      catch(error){
        console.log(error.message);
      }
  }
  else{
      const category=data.category.value;
      const sub_category=data.sub_category;
      const type=data.type;
      const imageurl=data.imageurl;
      const desc=data.desc;
      const price=data.price;
      console.log(category, sub_category, type, imageurl, desc);

      try{
        const response = await fetch('http://localhost:5000/fabrics',{
                        method:'POST',
                        headers:{'content-type':'application/json',Authorization:'Bearer '+ authCtx.token},
                        body:JSON.stringify({category:category, sub_category:sub_category, type:type, image:imageurl, desc:desc, price:price, created_by:authCtx.userId})
                        });
        console.log(response);
        const respdata=await response.json();
        console.log(respdata);
        alert(respdata.message);
        navigate('/fabrics');
      }
      catch(error){
        console.log(error.message);
      }
    }
  }
   const resetHandler=()=>{
        console.log("in reset");
        navigate('/fabrics');
   };
   return (

   <div className={classes.container}>
        <h2>Item Details</h2>
     <form className={classes.form}>
    <table><tbody  className={classes.control}>
         <tr >
           <td><label className={classes.label} htmlFor="category">Category type</label></td>
           <td><Controller
                           name="category"
                           control={control}
                           defaultValue={mode==='edit' ? category[CategoryIndex]:''}
                           rules={{ required: true }}
                           render={({ field }) => (
                             <Select {...field}  options={category}  isMulti={false} className={classes.select}
                             styles={{
                                 option: (provided) => ({
                                   ...provided,
                                   color: '#96075a',// Change text color for all options
                                    maxHeight:'20px',
                                    height:'20px'
                                 }),}}/>
                           )}
                         /></td></tr>

        <tr>
           <td><label htmlFor="sub_category">Sub-category</label></td>
           <td><input type="text" id="sub_category" name="sub_category"  placeholder="Silk/Linen/Chiffon/Georgette etc."
             {...register("sub_category")}  /></td></tr>

        <tr><td><label htmlFor="type">Type</label></td>
           <td><input id="type" type="text" name="type"  placeholder="Plain/Printed/Digital Print etc."
         {...register("type")}/></td></tr>


        <tr><td><label htmlFor="imageurl">Image URL</label></td>
            <td><input id="imageurl" type="text" name="imageurl" defaultValue={mode==='edit' ? item.image:''} placeholder="Enter url of the image to be displayed"
         {...register("imageurl")}/></td></tr>

         <tr><td><label htmlFor="desc">Description</label></td>
              <td><input id="desc" type="textarea" name="desc" defaultValue={mode==='edit' ? item.desc:''}
              placeholder="ex. Light weight, pink chiffon fabric with digital print"
            {...register("desc")}/></td></tr>

         <tr><td><label htmlFor="price">Price</label></td>
           <td style={{textAlign:'left'}}><input style={{width:'100px'}} id="price" type="text" name="price" defaultValue={mode==='edit' ? item.rate:''} placeholder="ex.500.00 / 500"
           onKeyPress={(e) => {
                 // Allow only digits, period, and backspace
                 const allowedChars = /[0-9.]/;
                 const key = String.fromCharCode(e.charCode);
                 if (!allowedChars.test(key)) {
                   e.preventDefault();
                 }
                 }}
         {...register("price")}/><span>Rs</span></td></tr>


    </tbody>
    </table>
        <div className={classes.action}>
         <button type="reset" onClick={resetHandler} className="button button-flat">
           Cancel
         </button>
         <button  type="submit" className="button" onClick={handleSubmit(submitHandler)}  disabled={isSubmitting}>
            Save
         </button>
        </div>
     </form>
    </div>
   );

}
export default EditFabricForm;

