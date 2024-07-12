import classes from './notification.module.css';
import ReactDOM from 'react';

const Notification = (props) => {
  let specialClasses = '';

  if (props.status === 'error') {
    specialClasses = classes.error;
  }
  if (props.status === 'success') {
    specialClasses = classes.success;
  }

  const cssClasses = `${classes.notification} ${specialClasses}`;

  return (
    <section className={cssClasses}>
      <p>{props.message}</p>

    </section>
  );
};

export default Notification;