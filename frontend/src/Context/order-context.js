import {createContext} from 'react';

export const OrderContext= createContext({
    item:[],
    totalQuantity:0,
    totalAmount:0,
    status:null,
    orderId:null,
    paymentId:null,

    createOrder:()=>{},
    updateStatus:()=>{},
    clearContext:()=>{},
    updatePaymentDetails:()=>{},
    updateItemDetails:()=>{},
    orders:[]
});