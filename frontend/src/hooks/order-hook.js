import {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';

export const useOrder=()=>{
    const [item,setItems]=useState([]);
    const [totalAmount,setTotalAmount]=useState(null);
    const [totalQuantity,setTotalQuantity]=useState(null);
    const [status,setStatus]=useState(null);
    const [orderId,setOrderId]=useState(null);
    const cartItems=useSelector((state) => state.cart.items);

    const createOrder=useCallback((items,totalQuantity,totalAmount,orderId)=>{
        setItems(items);
        setTotalAmount(totalAmount);
        setTotalQuantity(totalQuantity);
        setOrderId(orderId);
        setStatus('created');
    },[]);

    const updateStatus=useCallback((status)=>{
        setStatus(status);
    },[]);

    const clearContext=()=>{
        setItems(null);
        setTotalAmount(null);
        setTotalQuantity(null);
        setOrderId(null);
        setStatus(null);
    }

return {item, totalAmount, totalQuantity, status, orderId, createOrder, updateStatus, clearContext};


};