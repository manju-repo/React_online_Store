import { useParams, Link, useNavigate } from "react-router-dom";
import {OrderContext} from '../Context/order-context';
import {AuthContext} from '../Context/auth-context';
import {useContext, useState, useEffect} from 'react';
import Card from '../components/card';
import classes from './PaymentSuccess.module.css';

const PaymentSuccess = () => {

console.log("in PS");

    const {rzrOrderId,paymentId} = useParams();
    console.log(rzrOrderId,paymentId);
    const [orderData,setOrderData] = useState({item:[],status:'',totalQuantity:0,totalAmount:0});
    const {orderId,item,totalQuantity,totalAmount,status,clearContext,updateStatus}=useContext(OrderContext);
    const {isLoggedIn, userId, token}=useContext(AuthContext);
    const [cancelMsg,setCancelMsg]=useState(null);
    console.log(orderId,item,totalQuantity,totalAmount,status);
    const navigate=useNavigate();

    useEffect(() => {
        if(item.length===0)
            navigate('/');
        if (item.length > 0) {
            setOrderData({ item, status, totalQuantity, totalAmount });

        const transferPayment=async()=>{
        if(paymentId){
        console.log(item);
        const amountsByCreatedBy = item.reduce((acc, itm) => {
          if (acc[itm.created_by]) {
            acc[itm.created_by] += itm.totalPrice;
          } else {
            acc[itm.created_by] = itm.totalPrice;
          }
          return acc;
        }, {});

        console.log(amountsByCreatedBy);
        const mappedAmounts = Object.entries(amountsByCreatedBy).map(([createdBy, amount]) => ({ createdBy, amount }));
        console.log(mappedAmounts);

            try{
                for (const transfer of mappedAmounts) {
                  console.log(transfer.createdBy,transfer.amount);
                  const responseUser=await fetch(`http://localhost:5000/user/${transfer.createdBy}`);
                  if(responseUser){
                       const userData=await responseUser.json();
                       console.log(userData);
                       if(userData){
                           const response=await fetch('http://localhost:5000/payment/paymentTransfer',{
                                                  method:'POST',
                                                  headers:{
                                                      'Authorization': `Bearer ${token}`,
                                                      'content-type':'application/json'},
                                                  body:JSON.stringify({accountId:userData.user.account_number,amount:transfer.amount,paymentId:paymentId})
                                                  });
                            if(response){
                                const resData=await response.json();
                                console.log(resData);
                            }
                       }
                    }
                  }
                }
                catch(error){
                    console.log(error);
                }
      }
        }
         transferPayment();
        }
        return() => {
            clearContext();
         }
    }, []);

    const updateStock=async()=>{

        const products_response=await fetch(`http://localhost:5000/order/${rzrOrderId}`);
        if(!products_response) return null;
        const {data}=await products_response.json();
        console.log(data);
        for (const product of data) {
        const stock_response=await fetch('http://localhost:5000/store/stock',{
                                method:'PUT',
                                headers:{'content-type':'application/json'},
                                body:JSON.stringify({id:product.id,quantity:product.quantity})
            });

            console.log(stock_response);
        }
    }

    const cancelOrderHandler=async()=>{
        let concan=window.confirm('Are you sure you want to cancel your order?');
        if(concan){
        try{
            let resData=null;

            console.log(orderData.totalAmount, paymentId);
            const response=await fetch('http://localhost:5000/payment/paymentRefund',{
                                  method:'POST',
                                  headers:{
                                        'Authorization': `Bearer ${token}`,
                                        'content-type':'application/json'},
                                  body:JSON.stringify({amount:orderData.totalAmount, paymentId:paymentId})
                                  });
            if(!response){
                    throw Error("error refunding");
            }
            if(response){
                resData=await response.json();
                console.log(resData.data);
            }
            if(!resData.success){
                throw Error(resData.message);
            }
            const payment_response=await fetch('http://localhost:5000/orders/updatestatus',{
                        method:'PUT',
                        headers:{
                                'Authorization': `Bearer ${token}`,
                                'content-type':'application/json'},

                        body:JSON.stringify({id:orderId,status:'cancelled'})
            });
            if(payment_response){
                setCancelMsg("Your order is cancelled.\n Refund will be initiated after your payment reaches us.\nYou will be notified on your email")
                updateStatus('cancelled');
            }
        }
        catch(error){
            console.log(error.message);
            setCancelMsg("Your order could not be cancelled. Please try again or initiate a Return request once the product is delivered to you");
        }
        }
        }



    return (<><div><Link to="/">Go to Homepage</Link>
               <span ><Link onClick={cancelOrderHandler} style={{ marginRight: '10px' }}>Cancel Order</Link></span>
    </div>
    {cancelMsg && ( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                                              <p>{cancelMsg}</p></div>)}

    {orderData.status==='created' && !cancelMsg && (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
     <h2>Order successfully placed !</h2>

    </div>)
    }
    <Card className={classes.container} >
    <div style={{textAlign:'right',fontSize: '14px',fontColor:'white'}}>
        <div><span>Date of purchase: </span><span>{new Date().toLocaleDateString('en-IN')}</span></div>
        <div><span>Order Id:</span><span>{rzrOrderId}</span></div>
    </div>
            {orderData.item && orderData.item.map((itm)=>(

        <div key={itm.id} style={{ display: 'flex', alignItems: 'center' }}>
        <img src={itm.image} style={{ width: '100px', height: '100px' }}  alt="" />
        <span>{itm.type}
            <div>Rs. {itm.rate?.toFixed(2)} /meter</div>
        </span>
        {itm.category.toLowerCase()!=='fabrics' && <span><div>{itm.quantity} pcs</div></span>}
        {itm.category.toLowerCase()==='fabrics' && <span><div>{itm.quantity} meter</div></span>}
        <span><div>Rs. {(itm.quantity*itm.rate)?.toFixed(2)} </div></span>
        </div>

        ))}
        <hr style={{ borderTop: '1px solid #ccc', margin: '20px 0' }} />
         <div style={{ textAlign: 'right', fontSize: '14px' }}>
        <span>No. of items: {orderData.totalQuantity}</span>
        <span></span><span></span>
        <span>Amount: Rs. {orderData.totalAmount?.toFixed(2)}</span>
        </div>
    </Card>
    <h3>Check out other collections</h3>
    <span>Silk Fabrics</span><span>Mul cotton</span>
    </>
    );
}
export default PaymentSuccess;