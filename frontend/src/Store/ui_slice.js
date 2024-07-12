import { createSlice } from '@reduxjs/toolkit';

const uiSlice=createSlice({
    name:'ui',
    initialState:{notification: null,cartIsVisible: false},
    reducers:{
        toggle(state){
        console.log(state.cartIsVisible);
            state.cartIsVisible=!state.cartIsVisible;
        },

        setCartVisibility(state,action){
            state.cartIsVisible= action.payload;
        },

        showNotification(state,action){
            state.notification={
             status:action.payload.status,
             title:action.payload.title,
             message:action.payload.message,
            };
            console.log(state.notification);
        },

        clearNotification(state,action){
            state.notification={
              status: '',
              title: '',
              message: '',
            };
        },
    },
    });

    export const uiActions=uiSlice.actions;
    export default uiSlice;