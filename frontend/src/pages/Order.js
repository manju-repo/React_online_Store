import {useState,useEffect,useContext,useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {cartActions} from '../Store/cart_slice';
import PaymentForm from '../components/PaymentForm';
import Card from '../components/card';
import {OrderContext} from '../Context/order-context';
import {AuthContext} from '../Context/auth-context';


const OrderPage=()=>{

    const {orderId}=useParams();
    console.log(orderId);
    const dispatch=useDispatch();
    const {status,item, totalQuantity, totalAmount, updateStatus, updateItemDetails, updatePaymentDetails, orders}=useContext(OrderContext);
    const {isLoggedIn, userId, token}=useContext(AuthContext);
    console.log(item, totalQuantity, totalAmount);
    const navigate=useNavigate();
    const [razorpayKey,setKey]=useState(null);
    const [order,setOrder]=useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

useEffect(()=>{
    if(!status || status!=='created'){
        navigate('/');
        return;
    }

    if (!orders.includes(orderId)) {
        orders.push(orderId);
        console.log(orders);
        localStorage.setItem('orders',JSON.stringify(orders));
    }
    const checkOut=async()=>{
        let created_order=null;
        try{
            const responseKey=await fetch('http://localhost:5000/getkey',{
                                headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                },});
            if(!responseKey.ok)
                throw new Error("Payment failed");
            const {key}=await responseKey.json();
            setKey(key);
            const response=await fetch('http://localhost:5000/payment/checkout',{
                            method:'POST',
                            headers:{
                                    'Authorization': `Bearer ${token}`,
                                    'content-type':'application/json'},
                            body:JSON.stringify({amount:totalAmount})
                            });
            console.log(response);
            if(!response.ok)
                throw new Error("Payment failed");
            let {created_order}=await response.json();
            //let {order}=data;
            console.log(created_order);
            if(created_order){
                setOrder(created_order);
               console.log(order);
            }
        }catch(err){
            updateStatus('failed');
            console.log(err.message);
            navigate('/');
        }

    }
    checkOut();
},[orderId]);

 useEffect(() => {
        if (paymentSuccess && order) {
            navigate(`/paymentsuccess/${order.id}/${paymentSuccess}`);
        }
    }, [paymentSuccess, order, navigate]);


    const paymentHandler=async(formData)=>{
    //setClientData(formData);
    var options = {
          key: razorpayKey,
          amount: order.amount,
          currency: "INR",
          name: "J'Adore",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: order.id,
          handler: async(response)=>{
          const data=null;
            try{
                const responseData=await fetch('http://localhost:5000/payment/paymentverification',{
                            method:'POST',
                            headers:{
                                    'Authorization': `Bearer ${token}`,
                                    'content-type':'application/json'},
                            body:JSON.stringify(response)
                });
                let {data}=await responseData.json();

                //console.log(data);
                if(data){
                console.log("updating orders table", orderId);
                const currentDate = new Date().toISOString();

                     const payment_response=await fetch('http://localhost:5000/orders',{
                                method:'PUT',
                                headers:{
                                        'Authorization': `Bearer ${token}`,
                                        'content-type':'application/json'},
                                body:JSON.stringify({id:orderId,order_date:currentDate,order_id:order.id,rzr_payment_id:data,customer_data:formData,status:order.status})
                    });

            console.log(payment_response);
            updatePaymentDetails(data);
        //add status field to each item in order
            const status_update={date:currentDate, message:`Your order has been confirmed`};

            const response = await fetch(`http://localhost:5000/orders/updateStatus`, {
                    method: 'PUT',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({orderId, client_id:userId, items:item, status:status, update_date:currentDate,
                            status_update:status_update}),
            });
            console.log(response);
        //delete from Cart once order is placed

                const cart_id=JSON.parse(localStorage.getItem('cartId'))
                if(cart_id){
                    const response=await fetch(
                            `http://localhost:5000/cart/${cart_id}`,
                            { method:'DELETE'}
                          );
  //set cart_id to null in user table
                    try{

                        const response=await fetch(
                            'http://localhost:5000/user/cart',
                        {
                            method: 'PUT',
                            headers:{'content-type':'application/json'},
                            body:JSON.stringify({
                              id:userId,
                              cart_id:null})
                        })

                         if (!response){
                            throw new Error('Updating User failed');
                        }

                      }catch(error){
                        console.log(error.message);
                      }
                    }

                  localStorage.removeItem('cartId');
                  dispatch(cartActions.emptyCart());

//set order id to user table
                await fetch(
                        'http://localhost:5000/user/orders',
                    {
                        method: 'PUT',
                        headers:{
                                'Authorization': `Bearer ${token}`,
                                'content-type':'application/json'},
                        body:JSON.stringify({
                          id:userId,
                          orderId:orderId})
                    })

//=======================================

                //add vendor id and order details in vendor table
                console.log("adding in vendor", orderId);
                for(const itm of item){
                    await fetch('http://localhost:5000/vendor',{
                                method:'POST',
                                headers:{
                                        'Authorization': `Bearer ${token}`,
                                        'content-type':'application/json'},
                                body:JSON.stringify({vendor_id:itm.created_by, item_id:itm.id, item_details:itm, order_id:orderId, order_date:currentDate, quantity:itm.quantity, status:status, client_id:userId, client_details:formData})
                            });
                }
                updateStatus('created');
                setPaymentSuccess(data);
                //console.log(order.id,data);
                //navigate(`/paymentsuccess/${order.id}/${data}`);
                }
               }catch(error){
                    console.log(error.message);
               }


          },
          prefill: {
              "name": formData.name,
              "email": formData.email,
              "contact": formData.phone
          },
          notes: {
              "address": "J'Adore Corporate Office"
          },
          theme: {
              "color": "#8F0555"
          },
          method: {
                upi: true,
                card: true,
                netbanking: true,
                wallet: true
          },
          modal:{
            ondismiss:async() => {
                  console.log("Checkout form was closed");

                  // Update order status to 'aborted' or handle as needed
                  updateStatus('aborted');
                  const response=await fetch('http://localhost:5000/orders/abort',{
                          method:'PUT',
                          headers:{
                                  'Authorization': `Bearer ${token}`,
                                  'content-type':'application/json'},
                          body:JSON.stringify({orderId:orderId})
                  });

                  console.log(response);
                  alert("Payment was not completed. You can retry from your orders page.");

                  // Optional: Redirect user to a different page or perform other actions
                  navigate(-1);
                }
          }
    };
     var rzp1 = new window.Razorpay(options);
     rzp1.open();
 };
return(
    <> <p>{order} {razorpayKey}</p>
    {order !== null && razorpayKey !== null  && (
    <div style={{ display: 'flex',width:'100%' }}>
        <PaymentForm onSubmit={paymentHandler}/>
        {item.length!==0 &&
        <Card style={{ display: 'flex', flexDirection: 'column' }} >
        {item.map((itm)=>(
        <>
            <div style={{ display: 'flex', alignItems: 'bottom', color:'white' }}>
                <span><img src={itm.image} style={{ width: '50px', height: '50px' }}  alt="" /></span>
                <span>{itm.type}</span>
                <span>Rs. {itm.rate?.toFixed(2)}</span>
                <span>X {itm.quantity}</span>
                <span>Rs. {Number(itm.quantity*itm.rate)?.toFixed(2)}</span>
            </div></>
            ))}
            <div style={{alignItems:'bottom', textAlign:'right', color:'white'}}><span></span>
                <span>No. of items: {totalQuantity}</span>
                <span></span>
                <span>Amount: Rs {totalAmount?.toFixed(2)}</span>
            </div>
        </Card>}
    </div>
    )}
    </>
    );
};
export default OrderPage;