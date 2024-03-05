import { forwardRef, useImperativeHandle, useRef } from 'react';
import {useDispatch} from 'react-redux';
import { createPortal } from 'react-dom';
import {uiActions} from '../Store/ui_slice';


const Modal = forwardRef(function Modal({ children,onReset }, ref) {
  const dialog = useRef();
  const dispatch=useDispatch();
  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();

      },
        close(){
        dialog.current.close();
        console.log("modal close");
        }

    };
  });

  return createPortal(
    <dialog
      ref={dialog}  onClose={onReset}
      className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md"  >
      {children}
      <form method="dialog"   className="mt-4 text-right" >
        <button >Order Now</button>
       </form>
    </dialog>,
    document.getElementById('modal-root')
  );
});

export default Modal;