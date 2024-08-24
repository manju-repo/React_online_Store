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
            const existingItem=state.items.find((item)=>item.id===newItem.id && item.size===newItem.size);

            if(!existingItem){
            console.log("pushing new item");
               state.items.push({
                id:newItem.id,
                item_status:'created',
                quantity:quantity,
                rate:newItem.rate,
                amount:newItem.rate*quantity,
                type:newItem.type,
                image:newItem.image,
                created_by:newItem.created_by,
                category:newItem.category,
                sub_category:newItem.sub_category,
                desc:newItem.desc,
                details:newItem.details,
                size:newItem.size,
                alloted_stock:quantity
            });
                //state.totalQuantity++;
            }else{
                existingItem.quantity=quantity;
                existingItem.amount=quantity*newItem.rate;
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
               return total + item.amount;
            }, 0);
            console.log(state.items, state.totalQuantity, state.totalAmount);
            state.changed=true;
        },


        removeFromCart(state,action){
            //const id=action.payload.id;
            const rem_item=action.payload.item
            //alert(rem_item.quantity);
        //=========================================
        if(Number(rem_item.quantity)!==0){
                    //alert(`in condition ${rem_item.quantity}`);

            state.items=
                    state.items.map(item => {
                     if (item.id === rem_item.id && item.size===rem_item.size) {
                        if(item.alloted_stock===0)
                            return {
                              ...item,
                            quantity: item.quantity - 1,
                            amount: item.amount - item.rate,
                            alloted_stock: item.quantity-1
                            }
                        else
                        return {
                              ...item,
                            quantity: item.quantity - 1,
                            amount: item.amount - item.rate,
                            alloted_stock: item.alloted_stock-1
                            }
                    }
                  else
                    return item;
              })
              console.log(state.items);
         }
         else
             state.items=state.items.filter((item)=>item.id !== rem_item.id);   //removing item in case stock is zero and user wants to remove it or updated quantity is zero
console.log(state.items.length);
        //==========================================
            state.items=state.items.filter((item)=>item.quantity >= 1);

            state.totalQuantity = state.items.reduce((total, item) => {
                            if(item.category.toLowerCase()==='fabrics')
                               return total+1;
                            else
                                return total + item.quantity;
                        }, 0);
            //state.totalQuantity=state.items.length;
            state.totalAmount = state.items.reduce((total, item) => {
               return total + item.amount;
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
            const size=action.payload.size;
            state.items= state.items.map(item => {
                   if (item.id === id && item.size===size) {
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

    }
});


export const cartActions=cartSlice.actions;
export default cartSlice;