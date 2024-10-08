import {useEffect} from 'react';

const Support=()=>{
             const emailId="manjusha.gupte@gmail.com";
 useEffect(()=>{

        const sendEmail=async()=>{
            try{
                    const response=await fetch('http://localhost:5000/2fa/send-2fa',{
                    method: 'POST',
                    headers: {
                                'Content-Type': 'application/json', // Set Content-Type header
                              },
                    body:JSON.stringify({email:emailId}),
                });
                if(! response.ok){
                    throw Error('Could not send email');
                }
                //const respData= await response.json();
                console.log(response.status);
            }
            catch(error){
                console.log(error);
            }
          }

  sendEmail();
  },[emailId]);
  return(
<a href="mailto:manjusha.gupte@gmail.com" target="_blank" rel="noopener noreferrer">
    Send Email
</a>

  );
}
export default Support;