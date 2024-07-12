import {useContext} from 'react';
import {OrderContext} from '../Context/order-context';
const OrderDetails=()=>{
const orderCtx=useContext(OrderContext);
const items=orderCtx.item;
console.log(items);
return(
    {items.map((item)=>
        (<div style={{ display: 'flex'}}>
            <img src={item.image} style={{ width: '100px', height: '100px' }}  alt="" />
            <span>{item.type}
                <div >
                    <span>Rs. {item.rate}</span>
                    <span>Rs. {item.quantity} pcs</span>
                    <span>Rs. {item.totalPrice}</span>
                </div>
            </span>
            <div>
            <span>X {orderCtx.totalQuantity}</span>
            <span>Amount<div>Rs {orderCtx.totalAmount}.00</div></span>
        </div>);
    }
 );
}