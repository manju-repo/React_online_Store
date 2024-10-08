import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Outlet} from 'react-router-dom';
import MainNavigation from '../layout/MainNavigation';
import Notification from '../components/notification';
import MainMenu from '../layout/mainmenu';
import FooterMenu from '../layout/footermenu';
import {category} from '../components/category';
import classes from './root.module.css';


function RootLayout(){
  const notification = useSelector((state) => state.ui.notification);

return(
<>
    <MainNavigation/>
    <MainMenu items={category}/>
    <main className={classes.main}>
        <Outlet/>
    </main>
    <FooterMenu/>
</>);
}
export default RootLayout;