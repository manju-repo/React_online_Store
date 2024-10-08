import {useState, createContext, useEffect} from 'react';

export const WishlistContext = createContext({
  wishlist: [],
  updateWishlist: () => {},
  showModal: false,
  modalOpen: () => {},
});

