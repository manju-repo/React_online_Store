import {createContext} from 'react';

export const AuthContext= createContext({
    isLoggedIn: false,
    userId:null,
    token:null,
    isAdmin: false,
    superAdmin:false,
    login: ()=>{},
    logout: ()=>{},
    is2FAuthenticated:false,
    isSubscribed:null
})