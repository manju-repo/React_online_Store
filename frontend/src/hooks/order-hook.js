import {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';

export const useOrder=()=>{
    const [item,setItems]=useState([]);
    const [orders,setOrders]=useState([]);
    const [totalAmount,setTotalAmount]=useState(null);
    const [totalQuantity,setTotalQuantity]=useState(null);
    const [status,setStatus]=useState(null);
    const [orderId,setOrderId]=useState(null);
    const [paymentId,setPaymentId]=useState(null);
    const cartItems=useSelector((state) => state.cart.items);

    const createOrder=useCallback((items,totalQuantity,totalAmount,orderId)=>{
        setItems(items);
        setOrders(prevOrders => [...prevOrders, orderId]); // Use a functional update to maintain immutability
        setTotalAmount(totalAmount);
        setTotalQuantity(totalQuantity);
        setOrderId(orderId);
        setStatus('created');
    },[]);

    const updateStatus=useCallback((status)=>{
        setStatus(status);
    },[]);

    const updatePaymentDetails = useCallback((payment_id) => {
        setPaymentId(payment_id);
    }, []);

    /*const updateItemDetails = useCallback((updatedItem) => {
        setItems(prevItems => {
            // Find index of the item to update
            const itemIndex = prevItems.findIndex(item => item.id === updatedItem.id);
            return prevItems.map((item, index) =>
                index === itemIndex ? updatedItem : item
            );
        });
    }, []);*/

    const updateItemDetails = useCallback((updatedItems) => {
    setItems(prevItems => {
        // Create a map of updated items for quick lookup
        const updatedItemsMap = new Map(updatedItems.map(item => [item.id, item]));

        return prevItems.map(item =>
            updatedItemsMap.has(item.id) ? updatedItemsMap.get(item.id) : item
        );
    });
    }, []);


    const clearContext=()=>{
        setItems([]);
        setOrders([]);
        setTotalAmount(null);
        setTotalQuantity(null);
        setOrderId(null);
        setStatus(null);
        setPaymentId(null);
    }

return {item, orders, totalAmount, totalQuantity, status, orderId, paymentId, createOrder, updateStatus, clearContext, updateItemDetails, updatePaymentDetails};


};