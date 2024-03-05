import { createSlice } from '@reduxjs/toolkit';

const cartSlice=createSlice({
    name:'cart',
    initialState:{ items:[{id:'0',type:'',rate:0,quantity:0,totalPrice:0}],totalQuantity:0,changed:false },
    reducers:{

        addToCartFromList(state,action){
            const newItem=action.payload.item;
            const quantity=action.payload.quantity;

            state.items.push({
                id:newItem.Fabid,
                quantity:quantity,
                rate:newItem.price,
                totalPrice:newItem.price*quantity,
                type:newItem.type,
            });
            state.totalQuantity=state.totalQuantity+1;
            state.changed=true;


        },

        replaceCart(state,action){
            state.totalQuantity=action.payload.totalQuantity;
            state.items=action.payload.items;
        },

        addToCart(state,action){
            const newItem=action.payload.item;
            console.log(newItem);
            const quantity=Number(newItem.quantity||action.payload.quantity);
    console.log("quantity",quantity);
            const existingItem=state.items.find((item)=>item.id===newItem.id);
            state.changed=true;

            if(!existingItem){
               state.items.push({
                id:newItem.id,
                quantity:quantity,
                rate:newItem.rate,
                totalPrice:newItem.rate*quantity,
                type:newItem.type,
            })
                state.totalQuantity++;
            }else{
                existingItem.quantity+=quantity;
                existingItem.totalPrice+=quantity*newItem.rate;
            }
        },


        removeFromCart(state,action){
            const id=action.payload;
            const existingItem=state.items.find((item)=>item.id === id);
            if(existingItem.quantity===1){
                state.items=state.items.filter((item)=>item.id !== id);
                state.totalQuantity--;
            }else{
               existingItem.quantity-=0.5;
               existingItem.totalPrice-=existingItem.rate/2;
            }
            state.changed=true;
        },
    }
});


export const cartActions=cartSlice.actions;
export default cartSlice;