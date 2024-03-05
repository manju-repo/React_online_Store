import classes from './FabricItem.module.css';
import FabricItemOrder from './FabricItemOrder';
function FabricItem(props){
const item=props.item;
return(
<>
    <div className={classes.disp}>
        <div>
            <img src={item.image}/>

            <h2>{item.colour}</h2>
        </div>
        <div >
            <FabricItemOrder item={{id:item.Fabid,type:item.type,rate:item.price}}/>
        </div>
    </div>
</>
);
}
export default FabricItem;