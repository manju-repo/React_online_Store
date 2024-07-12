import { forwardRef, useImperativeHandle, useRef } from 'react';
import {useDispatch} from 'react-redux';
import { createPortal } from 'react-dom';
import {uiActions} from '../Store/ui_slice';
import classes from './modal.module.css';

const Modal = forwardRef(function Modal({ children,onReset,onOrder }, ref) {
  const dialog = useRef();
  const dispatch=useDispatch();
  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();

      },
        close(){
        dialog.current.close();
        }

    };
  });

  return createPortal(
    <dialog ref={dialog} className={classes.modal_wrapper}>
            <div className={classes.modal_content}>

        <button className={classes.close_button} onClick={() => dialog.current.close()}>X</button>
      {children}</div>
    </dialog>,
    document.getElementById('modal-root')
  );
});

export default Modal;