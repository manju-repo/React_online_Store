import {createContext} from 'react';

export const OrderContext= createContext({
    item:[],
    totalQuantity:0,
    totalAmount:0,
    status:null,
    orderId:null,
    createOrder:()=>{},
    updateStatus:()=>{},
    clearContext:()=>{},
    orders:[]
});