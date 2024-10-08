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

console.log(mode);
const [CategoryIndex,setCategoryIndex]=useState(0);

useEffect(() => {
    if (mode === 'edit') {
    console.log(mode);
        const index = category.findIndex(cat => cat.value === item.category);
        if (index !== -1) {
            setCategoryIndex(index);
        }
        let size, maxSize;
        try{
            size=JSON.parse(item.size);
        }
        catch(err){
            size=item.size;
        }

        try{
            maxSize=JSON.parse(item.maxSize);
        }
        catch(err){
            maxSize=item.maxSize;
        }
        console.log(item);
        //reset();
        if (item.image) {
        for (let i = 0; i < 5; i++) {
            if(!item.image[i]) continue;
           let imageNameFromPath = item.image[i].split('/').pop(); // Extract the file name from the path
           imageNames[`image${i+1}`] = imageNameFromPath;
           setImageNames(imageNames);
         }
        console.log(item.image);
         }
        reset({...item, sizeXS:size?.sizeXS, sizeS:size?.sizeS, sizeM:size?.sizeM, sizeL:size?.sizeL, sizeXL:size?.sizeXL, sizeXXL:size?.sizeXXL,
                TsizeXS:maxSize?.sizeXS, TsizeS:maxSize?.sizeS, TsizeM:maxSize?.sizeM, TsizeL:maxSize?.sizeL, TsizeXL:maxSize?.sizeXL, TsizeXXL:maxSize?.sizeXXL,
                image1:item.image[0],image2:item.image[1],image3:item.image[2],image4:item.image[3],image5:item.image[4],
                price:item.rate, category:category[CategoryIndex]
              });
    }
    else{
        const index = category.findIndex(cat => cat.value === itemCategory);
        setCategoryIndex(0);
        if (index !== -1) {
            setCategoryIndex(index);
        }
        console.log(index);
        //reset();
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
    setValue,
    watch
  } = useForm();

const navigate= useNavigate();
const authCtx=useContext(AuthContext);
const [imageNames, setImageNames] = useState({
    image1: 'Choose Image 1',
    image2: 'Choose Image 2',
    image3: 'Choose Image 3',
    image4: 'Choose Image 4',
    image5: 'Choose Image 5',
  });

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (file) {
      setImageNames((prevState) => ({
        ...prevState,
        [key]: file.name,
      }));
      setValue(key, file);

    }
  };

  const handleClearFile = (key) => {
    setImageNames((prevState) => ({
      ...prevState,
      [key]: `Choose ${key.charAt(0).toUpperCase() + key.slice(1)}`,
    }));
    // Reset the input value (you'll need a ref for each input to clear it programmatically)
    document.getElementById(key).value = '';
  };

  const submitHandler =async (data) => {
  console.log(mode);
  if(mode==='edit'){
      const product_code=data.product_code;
      const category=data.category.value.toLowerCase();
      const sub_category=data.sub_category;
      const type=data.type;
      //const imageurl=data.imageurl;
      const desc=data.desc;
      const price=data.price;
     // const details=data.details;
      const colour=data.colour;


      let size=null,stock=0,min_stock=0, maxSize=null;

      if(category==='fabrics'){
              stock=data.stock;
              size={sizeOne:stock}
              min_stock=data.minStock;
      }
      else{
              const sizeXS=Number(data.sizeXS);
              const sizeS=Number(data.sizeS);
              const sizeM=Number(data.sizeM);
              const sizeL=Number(data.sizeL);
              const sizeXL=Number(data.sizeXL);
              const sizeXXL=Number(data.sizeXXL);
              const TsizeXS=Number(data.TsizeXS);
              const TsizeS=Number(data.TsizeS);
              const TsizeM=Number(data.TsizeM);
              const TsizeL=Number(data.TsizeL);
              const TsizeXL=Number(data.TsizeXL);
              const TsizeXXL=Number(data.TsizeXXL);
          size={sizeXS:sizeXS,sizeS:sizeS,sizeM:sizeM,sizeL:sizeL,sizeXL:sizeXL,sizeXXL:sizeXXL};
          maxSize={sizeXS:TsizeXS,sizeS:TsizeS,sizeM:TsizeM,sizeL:TsizeL,sizeXL:TsizeXL,sizeXXL:TsizeXXL};
          stock= sizeXS+sizeS+sizeM+sizeL+sizeXL+sizeXXL;
      }
     const formData = new FormData(); // Use FormData to handle files and other inputs

        const details = watch("details"); // Assuming you are using react-hook-form's watch

        details.forEach((detail, index) => {
          if (detail) {
            formData.append(`details[${index}]`, detail); // Append without trailing commas
          }
        });
    for (let i = 1; i <= 5; i++) {
      const imageKey = `image${i}`;
      //const fileInput = data[imageKey];
      console.log(imageKey, data[imageKey]);
      //if (fileInput.files[0]) {
        formData.append(imageKey, data[imageKey]); // Append file only if one is selected

    }
    // Add other form fields (if any)
       // Object.keys(data).forEach((key) => {
         // if (!key.startsWith('image')) { // Skip images as they're already added
            //formData.append(key, data[key]);
            formData.append('product_code',product_code);
            formData.append('category',category);
            formData.append('sub_category',sub_category);
            formData.append('type',type);
            formData.append('desc',desc);
            formData.append('price',price);
            formData.append('colour',colour);
            formData.append('size',JSON.stringify(size));
            formData.append('maxSize',JSON.stringify(maxSize));
            formData.append('stock',stock);
            formData.append('min_stock',min_stock);

            //formData.append('details',details);




        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

      try{
        /*const response = await fetch(`http://localhost:5000/fabrics/${item.id}`,{
                        method:'PUT',
                        headers:{'content-type':'application/json',Authorization:'Bearer '+ authCtx.token},
                        body:JSON.stringify({product_code:product_code, category:category, sub_category:sub_category, type:type, image:imageurl, desc:desc,
                                price:price, colour:colour, size:size, stock:stock, details:details,created_by:authCtx.userId})
                        });*/
        const response = await fetch(`http://localhost:5000/fabrics/${item.id}`,{
                        headers:{Authorization:'Bearer '+ authCtx.token},
                        method:'PUT',
                        body:formData,
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
  console.log(data.category.value.toLowerCase());
      const product_code=data.product_code;
      const category=data.category.value.toLowerCase();
      const sub_category=data.sub_category;
      const type=data.type;
      const imageurl=data.imageurl;
      const desc=data.desc;
      const price=data.price;
      const details=data.details;
      const colour=data.colour;
      const size=data.size;
      const stock = size.reduce((total, item) => {
                           return total + Number(item);
                        }, 0);
      //const colour_options=data.colour_options;
      console.log(data);

      try{
        const response = await fetch('http://localhost:5000/fabrics',{
                        method:'POST',
                        headers:{'Content-Type':'application/json',Authorization:'Bearer '+ authCtx.token},
                        body:JSON.stringify({product_code:product_code, category:category, sub_category:sub_category, type:type, image:imageurl, desc:desc, price:price,
                                            details:details, colour:colour, size:size, stock:stock, created_by:authCtx.userId})
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
               <td  style={{width:'200px'}}><input type="text" id="product_code" name="product_code" defaultValue={mode==='edit' ? item.product_code:''}
                 {...register("product_code", { required: "product_code is required." })}  /></td></tr>
            { errors.product_code && <tr><td></td><td colSpan="2"><p className={classes.errorMsg}>{errors.product_code.message}</p></td></tr>}
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
                           maxWidth: '200px', // Maximum width
                         }),

                     option: (provided) => ({
                       ...provided,
                       color: '#96075a',// Change text color for all options
                        maxHeight:'50px',
                        height:'50px',
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



      {/*  <tr>
           <td><label htmlFor="imageurl">Image URL</label></td>
           <td style={{display:'flex', flexDirection:'column'}}>
             <input  type="text" id="imageurl1" name="imageurl1" placeholder="https://i.pinimg.com/236x/89/b7/12/89b712e5ce8fe976593736e5a59b3d4b.jpg"
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
          )}*/}

    <div>
        {/* Render the array of 5 file inputs */}
        {[...Array(5)].map((_, index) => {
          const imageKey = `image${index + 1}`;
          return (
          <tr>
          <td> <label htmlFor={imageKey}>Image {index + 1}</label></td>

          <td><label htmlFor={imageKey} className={classes.custom_file_upload}>
                {imageNames[imageKey]}
              </label>

           <input
                id={imageKey}
                type="file"
                name={imageKey}
                accept="image/*"
                {...register(imageKey)}
                onChange={(event) => {
                  register(imageKey).onChange(event); // Call default onChange
                  handleFileChange(event, imageKey); // Update the file name state
                }}
              />

              <button
                type="button"
                className={classes.clear_button}
                id={`clearButton-${imageKey}`}
                onClick={() => handleClearFile(imageKey)}
              >
                X
              </button></td>
            </tr>
          );
        })}
      </div>



         <tr><td><label htmlFor="desc">Description</label></td>
              <td><input id="desc" type="textarea" name="desc"
              placeholder="ex. Light weight, pink chiffon fabric with digital print"
            {...register("desc", {
                  required: "Description is required."})}/></td></tr>
            { errors.desc && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.desc.message}</p></td></tr>}

         <tr><td></td><td colspan="2" className={classes.help_text}>Description text will be displayed below your product image</td></tr>

            <tr><td><label htmlFor="colour">Colour</label></td>
           <td style={{textAlign:'left'}}><input style={{width:'120px'}} id="colour" type="text" name="colour" defaultValue={mode==='edit' ? item.colour:''} placeholder="White"
            {...register("colour", {
               required: "Colour is required.",})}/></td></tr>
             {errors.colour && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.colour.message}</p></td></tr>}


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
         {errors.price && <tr><td></td><td colspan="2"><p className={classes.errorMsg}>{errors.price.message}</p></td></tr>}


         <tr>
           <td><label htmlFor="details">Details</label></td>
           <td>
               {Array.from({ length: 5 }, (_, index) => (
                 <input
                   key={index}
                   type="text"
                   id={`details${index + 1}`}
                   name={`details.${index}`} // Use the same base name for registration
                   placeholder={index === 0 ? "Chiffon Mint Colour Bandhani Print 45 Inches Width Fabric" : ""}
                   {...register(`details.${index}`, { required: index === 0 ? "Enter at least one field of details" : false })}
                 />
               ))}
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
         {(item?.category==='fabrics' || category[CategoryIndex]==='fabrics')?(<>
            <tr><td><label htmlFor="stock">Stock</label></td>
                    <td style={{textAlign:'left'}}>
                    <input style={{width:'120px'}} id="stock" type="text" name="stock" defaultValue={mode==='edit' ? item.stock:''} placeholder="ex.50"
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
                  {errors.stock && <tr><td></td><td colSpan="2"><p className={classes.errorMsg}>{errors.stock.message}</p></td></tr>}

                  <tr style={{height:'40px'}}>
                  <td className={classes.help_text}>Enter minimum stock to be maintained</td>
                  <td style={{textAlign:'left'}}>
                  <input style={{width:'120px'}} id="minStock" type="text" name="minStock" defaultValue={mode==='edit' ? item.min_stock:''} placeholder="ex.50"
                   onKeyPress={(e) => {
                        // Allow only digits, period, and backspace
                        const allowedChars = /[0-9.]/;
                        const key = String.fromCharCode(e.charCode);
                        if (!allowedChars.test(key)) {
                          e.preventDefault();
                        }
                        }}
                {...register("minStock", {
                      required: "Enter minimum Stock",
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/, // Regular expression to match numbers with optional two decimal places
                        message: "Please enter valid Number."
                      }})}/></td></tr>
                {errors.minStock && <tr><td></td><td colSpan="2"><p className={classes.errorMsg}>{errors.minStock.message}</p></td></tr>}
         </>):(<>
         <tr>
            <td><label htmlFor="sizes">Size</label></td>
            <td style={{display:'flex',fontSize:'10px'}}>
            <span style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top'}}>XS</span>
            <span style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top'}}>S</span>
            <span style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top'}}>M</span>
            <span style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top'}}>L</span>
            <span style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top'}}>XL</span>
            <span style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top'}}>XXL</span></td>
         </tr>
         <tr style={{height:'40px'}}>
            <td className={classes.help_text}>Enter stock for each size</td>
            <td style={{display:'flex',justifyContent:'top'}}>
              <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="sizeXS" name="sizeXS" defaultValue={mode==='edit' ? item.size?.XS||'0':'0'} {...register("sizeXS")}/>
              <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="sizeS" name="sizeS" defaultValue={mode==='edit' ? item.size?.S||'0':'0'} {...register("sizeS")} />
              <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="sizeM" name="sizeM" defaultValue={mode==='edit' ? item.size?.M||'0':'0'} {...register("sizeM")} />
              <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="sizeL" name="sizeL" defaultValue={mode==='edit' ? item.size?.L||'0':'0'} {...register("sizeL")} />
              <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="sizeXL" name="sizeXL" defaultValue={mode==='edit' ? item.size?.XL||'0':'0'} {...register("sizeXL")} />
              <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="sizeXXL" name="sizeXXL" defaultValue={mode==='edit' ? item.size?.XXL||'0':'0'} {...register("sizeXXL")} />
            </td>
         </tr>
         <tr style={{height:'40px'}}>
             <td className={classes.help_text}>Enter minimum stock to be maintained for each size</td>
             <td style={{display:'flex',justifyContent:'top'}}>
               <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="TsizeXS" name="TsizeXS" defaultValue={mode==='edit' ? item.maxSize?.sizeXS||'0':'0'}  {...register("TsizeXS")}/>
               <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="TsizeS" name="TsizeS" defaultValue={mode==='edit' ? item.maxSize?.sizeS||'0':'0'} {...register("TsizeS")} />
               <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="TsizeM" name="TsizeM" defaultValue={mode==='edit' ? item.maxSize?.sizeM||'0':'0'} {...register("TsizeM")} />
               <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="TsizeL" name="TsizeL" defaultValue={mode==='edit' ? item.maxSize?.sizeL||'0':'0'} {...register("TsizeL")} />
               <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="TsizeXL" name="TsizeXL" defaultValue={mode==='edit' ? item.maxSize?.sizeXL||'0':'0'} {...register("TsizeXL")} />
               <input style={{height:'30px',width:'30px',minWidth:'30px',justifyContent:'top',textAlign:'center',padding:'0'}} type="text" id="TsizeXXL" name="TsizeXXL" defaultValue={mode==='edit' ? item.maxSize?.sizeXXL||'0':'0'} {...register("TsizeXXL")} />
             </td>
          </tr>
          </>)}
{/*
            <td style={{display:'flex', flexDirection:'column'}}>
              <label  type="text" id="col_opt1" name="col_opt1" placeholder="white" {...register("col_opt.0")}/>
              <input  type="text" id="col_opt2" name="col_opt2" defaultValue={null} {...register("col_opt.1")} />
              <input  type="text" id="col_opt3" name="col_opt3" defaultValue={null} {...register("col_opt.2")} />
              <input  type="text" id="col_opt4" name="col_opt4" defaultValue={null} {...register("col_opt.3")} />
              <input  type="text" id="col_opt5" name="col_opt5" defaultValue={null} {...register("col_opt.4")} />
            </td>
         </tr>
         <tr><td></td><td colspan="2" className={classes.help_text}>Please make sure to add products with the code format 'product-code-colour' for all the colour options given above to display the colour options for your product.</td></tr>
          <tr><td></td><td style={{textAlign:'center',width:'600px'}}>URL of image</td><td style={{textAlign:'center',width:'150px'}}>Colour</td>
         </tr>
         <tr><td style={{width:'186.35px', minWidth:'186.35px'}}></td>

            <td style={{display:'flex', flexDirection:'column'}}>
              <input  type="text" id="col_opt_url1" name="col_opt_url1" placeholder="https://i.pinimg.com/236x/89/b7/12/89b712e5ce8fe976593736e5a59b3d4b.jpg" {...register("col_opt_url.0")}/>
              <input  type="text" id="col_opt_url2" name="col_opt_url2" defaultValue={null} {...register("col_opt_url.1")} />
              <input  type="text" id="col_opt_url3" name="col_opt_url3" defaultValue={null} {...register("col_opt_url.2")} />
              <input  type="text" id="col_opt_url4" name="col_opt_url4" defaultValue={null} {...register("col_opt_url.3")} />
              <input  type="text" id="col_opt_url5" name="col_opt_url5" defaultValue={null} {...register("col_opt_url.4")} />
            </td>

            <td style={{display:'flex', flexDirection:'column'}}>
              <input  type="text" id="col_opt1" name="col_opt1" placeholder="white" {...register("col_opt.0")}/>
              <input  type="text" id="col_opt2" name="col_opt2" defaultValue={null} {...register("col_opt.1")} />
              <input  type="text" id="col_opt3" name="col_opt3" defaultValue={null} {...register("col_opt.2")} />
              <input  type="text" id="col_opt4" name="col_opt4" defaultValue={null} {...register("col_opt.3")} />
              <input  type="text" id="col_opt5" name="col_opt5" defaultValue={null} {...register("col_opt.4")} />
            </td>
         </tr>
*/}
    </tbody>
    </table>
        <div style={{marginTop:'40px',marginBottom:'40px'}}>
         <button  className={classes.button} type="reset" onClick={resetHandler} >
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

