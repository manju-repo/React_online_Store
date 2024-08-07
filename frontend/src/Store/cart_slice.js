import { createSlice } from '@reduxjs/toolkit';

const cartSlice=createSlice({
    name:'cart',
    initialState:{ items:[],totalQuantity:0,totalAmount:0,changed:false,isInitial:true },
    reducers:{

        setChanged(state,action){
            state.changed=false;
        },

        replaceCart(state,action){
            state.totalQuantity=action.payload.totalQuantity;
            state.totalAmount=action.payload.totalAmount;
            state.items=action.payload.items;
            state.isInitial=false;
        },

        addToCart(state,action){
            const newItem=action.payload.item;
            console.log(newItem);
            const quantity=Number(newItem.quantity||action.payload.quantity);
            const existingItem=state.items.find((item)=>item.id===newItem.id);

            if(!existingItem){
            console.log("pushing new item");
               state.items.push({
                id:newItem.id,
                quantity:quantity,
                rate:newItem.rate,
                totalPrice:newItem.rate*quantity,
                type:newItem.type,
                image:newItem.image,
                created_by:newItem.created_by,
                category:newItem.category,
                alloted_stock:quantity
            });
                //state.totalQuantity++;
            }else{
                existingItem.quantity=quantity;
                existingItem.totalPrice=quantity*newItem.rate;
                existingItem.alloted_stock=existingItem.alloted_stock+(quantity-existingItem.alloted_stock);
            }
            //state.totalAmount+=Number(quantity)*Number(newItem.rate);
            //state.totalQuantity=state.items.length;
            state.totalQuantity = state.items.reduce((total, item) => {
                        if(item.category.toLowerCase()==='fabrics')
                           return total+1;
                        else
                            return total + item.quantity;
                    }, 0);

            state.totalAmount = state.items.reduce((total, item) => {
               return total + item.totalPrice;
            }, 0);
            console.log(state.items, state.totalQuantity, state.totalAmount);
            state.changed=true;
        },


        removeFromCart(state,action){
            //const id=action.payload.id;
            const rem_item=action.payload.item
            console.log(rem_item);
        //=========================================
        if(rem_item.quantity){
                state.items=
                        state.items.map(item => {
                         if (item.id === rem_item.id) {
                            if(item.alloted_stock===0)
                                return {
                                  ...item,
                                quantity: item.quantity - 1,
                                totalPrice: item.totalPrice - item.rate,
                                alloted_stock: item.quantity-1
                                }
                            else
                            return {
                                  ...item,
                                quantity: item.quantity - 1,
                                totalPrice: item.totalPrice - item.rate,
                                alloted_stock: item.alloted_stock-1
                                }
                        }
                      else
                        return item;
                  })
                  console.log(state.items);
         }
         else
             state.items=state.items.filter((item)=>item.id === rem_item.id);   //removing item in case stock is zero and user wants to remove it

        //==========================================
            state.items=state.items.filter((item)=>item.quantity !== 0);

            state.totalQuantity = state.items.reduce((total, item) => {
                            if(item.category.toLowerCase()==='fabrics')
                               return total+1;
                            else
                                return total + item.quantity;
                        }, 0);
            //state.totalQuantity=state.items.length;
            state.totalAmount = state.items.reduce((total, item) => {
               return total + item.totalPrice;
            }, 0);
            state.changed=true;
          console.log(state.items);

        },

        emptyCart(state,action){
            state.items=[];
            state.totalQuantity=0;
            state.totalAmount=0;
        },

        releaseStock(state,action){
            const id=action.payload.id;
            state.items= state.items.map(item => {
                   if (item.id === id) {
                      return {
                        ...item,
                      alloted_stock:0
                   };
                }
                else
                  return item;
            });
            console.log(state.items);
        }
       /* findCartTotal(state,action){
            state.totalAmount = state.items.reduce((total, item) => {
               return total + item.totalPrice;
            }, 0);
        },

        changeCartItem(state,action){
            const id=action.payload.id;
            const qty=action.payload.quantity;
            if(qty===0){
                state.items=state.items.filter((item)=>item.id !== id);
                state.totalQuantity--;
            }else{
                const existingItem=state.items.find((item)=>item.id===id);
                existingItem.quantity=Number(qty);
                existingItem.amount=Number(qty)*(existingItem.rate);
            }
            state.changed=true;
        }*/
    }
});


export const cartActions=cartSlice.actions;
export default cartSlice;