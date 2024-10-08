import { useState, useContext ,useEffect} from 'react';
import { AuthContext } from '../Context/auth-context';

const SubscriptionForm = () => {
  const [isEmailSub, setEmailSub] = useState(null);
  const [isSmsSub, setSmsSub] = useState(null);
  const [isPushSub, setPushSub] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const {token, isSubscribed, setSubscription}=useContext(AuthContext);
  const [saved,setSaved]=useState(true);
  const [subscriptions,setSubscriptions] = useState(null);
 useEffect(()=>{
    const fetchPref=async()=>{
        const response=await fetch(`http://localhost:5000/user/subscriptions`,{
              method: 'GET',
              headers:{'Authorization':'Bearer '+ token},
          });
          if(response.ok){
                const {data}=await response.json();
                console.log(data);
                const preferences = data.notificationPreferences;
                setSubscriptions(preferences); // Store the full preferences object if needed

                // Set the individual subscription states
                setEmailSub(preferences?.emailSubscribed || false);
                setSmsSub(preferences?.smsSubscribed || false);
                setPushSub(preferences?.pushSubscribed || false);

                // Set phone number only if SMS subscription is true
                if (preferences?.smsSubscribed) {
                    setPhoneNumber(preferences?.phoneNumber || '');
                }
            }
    }
    fetchPref();
 },[]);


const hasChanged = () => {
  return (
    isEmailSub !== subscriptions?.emailSubscribed ||
    isSmsSub !== subscriptions?.smsSubscribed ||
    isPushSub !== subscriptions?.pushSubscribed ||
    (isSmsSub && phoneNumber !== subscriptions?.phoneNumber)
  );
};

  const handleSubmit =async (e) => {
      e.preventDefault();
       const updatedSubscriptions={
      emailSubscribed: isEmailSub,
      smsSubscribed: isSmsSub,
      pushSubscribed: isPushSub,
      phoneNumber: isSmsSub ? phoneNumber : null,
    };
    console.log(subscriptions);
    const response=await fetch(`http://localhost:5000/user/subscriptions`,
          {
              method: 'PUT',
              headers:{'content-type':'application/json', 'Authorization':'Bearer '+ token},
              body:JSON.stringify({
                subscriptions:updatedSubscriptions})
          });
      console.log(response);
setSubscriptions(updatedSubscriptions);
setSubscription(updatedSubscriptions);      //setting in the auth Context
  };

    const handleCancel=() =>{
        setEmailSub(subscriptions.emailSubscribed);
        setSmsSub(subscriptions.smsSubscribed);
        setPushSub(subscriptions.pushSubscribed);
        setPhoneNumber(subscriptions.phoneNumber || '');
    }


  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', textAlign: 'left', border:'2px solid pink' }}>
      <h3 style={{textAlign:'center',marginBottom:'40px',backgroundColor:'pink'}}>Subscribe to Notifications</h3>
    <div style={{display:'flex', justifyContent:'top'}}>
      {/* Email Notifications */}
      <div style={{justifyContent:'top',display:'flex',width:'500px'}}>
        <input style={{width:'50px'}}
          type="checkbox"
          checked={!!isEmailSub}
          onChange={() => setEmailSub(!isEmailSub)}
          id="emailSub"
        />
        <label htmlFor="emailSub" style={{ marginLeft: '10px', justifyContent:'top' }}>Email Notifications</label>
      </div>

      {/* SMS Notifications */}
      <div style={{justifyContent:'top',display:'flex',width:'500px'}}>
        <input  style={{width:'50px'}}
          type="checkbox"
          checked={!!isSmsSub}
          onChange={() => setSmsSub(!isSmsSub)}
          id="smsSub"
        />
        <label htmlFor="smsSub" style={{ marginLeft: '10px' }}>SMS Notifications</label>
      </div>

        {/* Push Notifications */}
      <div style={{justifyContent:'top',display:'flex',width:'500px'}}>
        <input style={{width:'50px', color:'black'}}
          type="checkbox"
          checked={!!isPushSub}
          onChange={() =>  setPushSub(!isPushSub)}
          id="pushSub"
        />
        <label htmlFor="pushSub" style={{ marginLeft: '10px' }}>Browser Push Notifications</label>
      </div>
      </div>

      {/* Phone Number Input */}
        {isSmsSub && (
            <div style={{ marginLeft: '500px', marginBottom: '10px' }}>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  style={{ width:'200px'}}
                />
          </div>
            )}




      <div style={{textAlign:'center',fontStyle:'italic'}}><p>(To unsubscribe clear the checkbox)</p></div>
       <div style={{textAlign:'center',marginTop:'20px'}} >
        <button type="submit" style={{ marginTop: '20px',padding: '10px 10px',backgroundColor: 'pink',
                                       color: 'black',border: 'none',borderRadius: '5px',cursor: 'pointer',
                                       opacity: hasChanged() ? 1 : 0.5,}}
                                        disabled={!hasChanged()}>
                                       OK</button>

        <button type="button" onClick={handleCancel} style={{ marginTop: '20px',padding: '10px 10px',backgroundColor: 'pink',
                                      color: 'black',border: 'none',borderRadius: '5px',cursor: 'pointer'}}>Cancel</button>
       </div>

    </form>
  );
};

export default SubscriptionForm;
