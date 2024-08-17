import {useNavigate, useParams} from 'react-router-dom';
import {useContext, useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import classes from './fabricform.module.css';
import {AuthContext} from '../Context/auth-context';
import {category} from './category';

const FabricForm=(props)=>{
let {mode,item}=props;
const {itemCategory}=useParams();
console.log(itemCategory);
if (mode!=='edit') mode='add';

//const {item}=props;
/*const category = [
  { value: "Fabrics", label: "Fabrics" },
  { value: "Sarees", label: "Sarees" },
  { value: "Lehengas", label: "Lehengas" },
  { value: "Salwar Suits", label: "Salwar Suits" },
  { value: "Dupattas", label: "Dupattas" },
  { value: "Shrugs", label: "Shrugs" }
];*/

const [CategoryIndex,setCategoryIndex]=useState(0);

useEffect(() => {
    if (mode === 'edit') {
        const index = category.findIndex(cat => cat.value === item.category);
        if (index !== -1) {
            setCategoryIndex(index);
        }
        reset();
        reset({...item, imageurl:item.image, price:item.rate, category:category[CategoryIndex]});
    }
    else{
        const index = category.findIndex(cat => cat.value === itemCategory);
        if (index !== -1) {
            setCategoryIndex(index);
        }
        reset();
        reset({...item, category:category[CategoryIndex]});

    }
     return() => {
        reset();
     }
}, [item]);

const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm();

const navigate= useNavigate();
const authCtx=useContext(AuthContext);


  const submitHandler =async (data) => {
  console.log(mode);
  if(mode==='edit'){
      const product_code=data.product_code;
      const category=data.category.value.toLowerCase();
      const sub_category=data.sub_category;
      const type=data.type;
      const imageurl=data.imageurl;
      const desc=data.desc;
      const price=data.price;
      const details=data.details;
      const colour=data.colour;
      const stock=data.stock;
      console.log("data: ",data);

      try{
        const response = await fetch(`http://localhost:5000/fabrics/${item.id}`,{
                        method:'PUT',
                        headers:{'content-type':'application/json',Authorization:'Bearer '+ authCtx.token},
                        body:JSON.stringify({product_code:product_code, category:category, sub_category:sub_category, type:type, image:imageurl, desc:desc,
                                price:price, colour:colour, stock:stock, details:details})
                        });
        console.log(response);
        const respdata=await response.json();
        console.log(respdata);

        navigate('/store/'+category);
      }
      catch(error){
        console.log(error.message);
      }
  }
  else{
      const product_code=data.product_code;
      const category=data.category.value.toLowerCase();
      const sub_category=data.sub_category;
      const type=data.type;
      const imageurl=data.imageurl;
      const desc=data.desc;
      const price=data.price;
      const details=data.details;
      const colour=data.colour;
      const stock=data.stock;
      console.log(data);

      try{
        const response = await fetch('http://localhost:5000/fabrics',{
                        method:'POST',
                        headers:{'content-type':'application/json',Authorization:'Bearer '+ authCtx.token},
                        body:JSON.stringify({product_code:product_code, category:category, sub_category:sub_category, type:type, image:imageurl, desc:desc, price:price,
                                            details:details, colour:colour, stock:stock, created_by:authCtx.userId})
                        });
        console.log(response);
        const respdata=await response.json();
        console.log(respdata);
        navigate('/store/'+category);
      }
      catch(error){
        console.log(error.message);
      }
    }
  }
   const resetHandler=()=>{
        navigate('/store/'+category[CategoryIndex].value);
   };
   return (

   <div className={classes.container}>
     <form className={classes.form}>
    <table><tbody className={classes.control}>

         <tr>
               <td><label htmlFor="product_code">Product Code</label></td>
               <td><input type="text" id="product_code" name="product_code" defaultValue={mode==='edit' ? item.product_code:''}
                 {...register("product_code", { required: "product_code is required." })}  /></td></tr>
            { errors.product_code && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.product_code.message}</p></td></tr>}
         <tr>
           <td><label htmlFor="category">Category</label></td>
           <td><Controller
               name="category"
               control={control}
               defaultValue={category[CategoryIndex]}
               rules={{ required: true }}
               render={({ field }) => (
                 <Select {...field}  options={category}  isMulti={false}
                 styles={{
                  control: (provided) => ({
                           ...provided,
                           minWidth: '200px', // Minimum width
                           maxWidth: '300px', // Maximum width
                         }),

                     option: (provided) => ({
                       ...provided,
                       color: '#96075a',// Change text color for all options
                        maxHeight:'20px',
                        height:'20px',
                     }),}}/>
               )}
             /></td></tr>
  {errors.category && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.category.message}</p></td></tr>}

        <tr>
           <td><label htmlFor="sub_category">Sub-category</label></td>
           <td><input type="text" id="sub_category" name="sub_category" defaultValue={mode==='edit' ? item.sub_category:''} placeholder="Silk/Linen/Chiffon/Georgette etc."
             {...register("sub_category", { required: "Sub-category type is required." })}  /></td></tr>
        { errors.sub_category && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.sub_category.message}</p></td></tr>}

        <tr><td><label htmlFor="type">Type</label></td>
           <td><input id="type" type="text" name="type" defaultValue={mode==='edit' ? item.type:''} placeholder="Plain/Printed/Digital Print etc."
         {...register("type", {
               required: "Type is required."})}/></td></tr>
         { errors.type && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.type.message}</p></td></tr>}



        <tr>
           <td><label htmlFor="imageurl">Image URL</label></td>
           <td style={{display:'flex', flexDirection:'column'}}>
             <input  type="text" id="imageurl" name="imageurl1" placeholder="https://i.pinimg.com/236x/89/b7/12/89b712e5ce8fe976593736e5a59b3d4b.jpg"
             {...register("imageurl.0",{ required: "Enter URL of the image to be displayed" })} />
             <input  type="text" id="imageurl2" name="imageurl2" defaultValue={null} {...register("imageurl.1")} />
             <input  type="text" id="imageurl3" name="imageurl3" defaultValue={null} {...register("imageurl.2")} />
             <input  type="text" id="imageurl4" name="imageurl4" defaultValue={null} {...register("imageurl.3")} />
             <input  type="text" id="imageurl5" name="imageurl5" defaultValue={null} {...register("imageurl.4")} />
           </td>
         </tr>

         {errors.imageurl && (
            <tr>
              <td></td>
              <td colSpan="2">
                {errors.imageurl.map((error, index) => (
                  error && <p key={index} className={classes.errorMsg}>{error.message}</p>
                ))}
              </td>
            </tr>
          )}

         <tr><td><label htmlFor="desc">Description</label></td>
              <td><input id="desc" type="textarea" name="desc"
              placeholder="ex. Light weight, pink chiffon fabric with digital print"
            {...register("desc", {
                  required: "Description is required."})}/></td></tr>
            { errors.desc && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.desc.message}</p></td></tr>}

            <tr><td><label htmlFor="colour">Colour</label></td>
           <td style={{textAlign:'left'}}><input style={{width:'120px'}} id="colour" type="text" name="colour" defaultValue={mode==='edit' ? item.colour:''} placeholder="White"
            {...register("colour", {
               required: "Colour is required.",})}/></td></tr>
             {mode!=='edit' && errors.colour && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.colour.message}</p></td></tr>}


            <tr><td><label htmlFor="price">Price</label></td>
           <td style={{textAlign:'left'}}><input style={{width:'120px'}} id="price" type="text" name="price" defaultValue={mode==='edit' ? item.rate:''} placeholder="ex.500.00 / 500"
           onKeyPress={(e) => {
                 // Allow only digits, period, and backspace
                 const allowedChars = /[0-9.]/;
                 const key = String.fromCharCode(e.charCode);
                 if (!allowedChars.test(key)) {
                   e.preventDefault();
                 }
                 }}
         {...register("price", {
               required: "Price is required.",
               pattern: {
                 value: /^\d+(\.\d{1,2})?$/, // Regular expression to match numbers with optional two decimal places
                 message: "Please enter a valid price."
               }})}/><span>Rs</span></td></tr>
         {mode!=='edit' && errors.price && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.price.message}</p></td></tr>}

        <tr><td><label htmlFor="stock">Stock</label></td>
           <td style={{textAlign:'left'}}><input style={{width:'120px'}} id="stock" type="text" name="stock" defaultValue={mode==='edit' ? item.stock:''} placeholder="ex.50"
           onKeyPress={(e) => {
                 // Allow only digits, period, and backspace
                 const allowedChars = /[0-9.]/;
                 const key = String.fromCharCode(e.charCode);
                 if (!allowedChars.test(key)) {
                   e.preventDefault();
                 }
                 }}
         {...register("stock", {
               required: "Stock is required.",
               pattern: {
                 value: /^\d+(\.\d{1,2})?$/, // Regular expression to match numbers with optional two decimal places
                 message: "Please enter valid stock."
               }})}/></td></tr>
         {mode!=='edit' && errors.stock && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.stock.message}</p></td></tr>}

         <tr>
           <td><label htmlFor="details">Details</label></td>
           <td>
             <input  type="text" id="details1" name="details1" placeholder="Chiffon Mint Colour Bandhani Print 45 Inches Width Fabric"
              {...register("details.0",{ required: "Enter atleast one field of details" })} />
             <input  type="text" id="details2" name="details2" {...register("details.1")} />
             <input  type="text" id="details3" name="details3" {...register("details.2")} />
             <input  type="text" id="details4" name="details4" {...register("details.3")} />
             <input  type="text" id="details5" name="details5" {...register("details.4")} />
           </td>
         </tr>
         {errors.details && (
           <tr>
             <td></td>
             <td colSpan="2">
               {errors.details.map((error, index) => (
                 error && <p key={index} className={classes.errorMsg}>{error.message}</p>
               ))}
             </td>
           </tr>
         )}

    </tbody>
    </table>
        <div>
         <button className={classes.button} type="reset" onClick={resetHandler} >
           Cancel
         </button>
         <button  className={classes.button} type="submit"  onClick={handleSubmit(submitHandler)}  disabled={isSubmitting}>
            Save
         </button>
        </div>
     </form>
    </div>
   );

}
export default FabricForm;

