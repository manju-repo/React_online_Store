import {createContext} from 'react';

export const WishlistContext= createContext({
    wishlist:[],
    updateWishlist:()=>{},
    clearWishlistContext:()=>{},
});