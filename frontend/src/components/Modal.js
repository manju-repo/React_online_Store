import { useEffect, forwardRef, useImperativeHandle, useRef, useContext } from 'react';
//import {useDispatch} from 'react-redux';
import { createPortal } from 'react-dom';
import {uiActions} from '../Store/ui_slice';
import classes from './modal.module.css';
import {WishlistContext} from '../Context/wishlist-context';

const Modal = forwardRef(function Modal({ children,onReset,onOrder }, ref) {
  const dialog = useRef();
    const {modalOpen, showModal}=useContext(WishlistContext);
 useImperativeHandle(ref, () => ({
     open() {
       modalOpen(true);
       dialog.current.showModal(); // Opens the modal
     },
     close() {
       modalOpen(false);
       dialog.current.close(); // Closes the modal

     },
   }));

   useEffect(() => {
     const handleEscape = (event) => {
       if (event.key === 'Escape') {
         modalOpen(false);
         dialog.current.close(); // Close modal on Escape key press
       }
     };

     window.addEventListener('keydown', handleEscape); // Add event listener

     return () => {
        modalOpen(false);
       window.removeEventListener('keydown', handleEscape); // Clean up
     };
   }, []);

  return createPortal(
    <dialog ref={dialog} className={classes.modal_wrapper}>
            <div className={classes.modal_content}>

        <button className={classes.close_button} onClick={() =>{modalOpen(false); dialog.current.close()}}>X</button>
      {children}</div>
    </dialog>,
    document.getElementById('modal-root')
  );
});

export default Modal;