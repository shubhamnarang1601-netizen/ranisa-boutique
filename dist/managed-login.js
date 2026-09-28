const managedStatus=document.getElementById('managedStatus');
window.otpless=async user=>{
  if(!user?.idToken){managedStatus.textContent='Google sign-in could not be verified. Please try again.';return;}
  const identity=user.identities?.find(item=>item.identityType==='EMAIL'&&item.channel==='OAUTH'&&item.verified===true&&item.methods?.some(method=>['GOOGLE','GMAIL'].includes(method)));
  if(!identity){managedStatus.textContent='Please choose Google with a verified email address.';return;}
  managedStatus.textContent='Verifying your Google account…';
  try{
    const response=await fetch(`${RANISA_DB}/functions/v1/ranisa-otpless-verify`,{
      method:'POST',headers:{apikey:RANISA_KEY,'Content-Type':'application/json'},body:JSON.stringify({idToken:user.idToken}),
    });
    const verified=await response.json();
    if(!response.ok)throw new Error(verified.error||'Sign-in could not be verified.');
    if(verified.email!==String(identity.identityValue).toLowerCase())throw new Error('Email identity did not match.');
    sessionStorage.setItem('ranisaOtplessSession',JSON.stringify({idToken:user.idToken,expiresAt:verified.expiresAt,email:verified.email}));
    const pending=Number(sessionStorage.getItem('ranisaPendingCartProduct'));
    if(sessionStorage.getItem('ranisaPendingCartProduct')!==null&&Number.isSafeInteger(pending)&&pending>=0){
      await cartRequest('set',pending,1);
      sessionStorage.removeItem('ranisaPendingCartProduct');
      location.href='/cart/';
    }else location.href=new URLSearchParams(location.search).get('return')==='/cart/'?'/cart/':'/account/';
  }catch(error){managedStatus.textContent=error.message||'Sign-in did not complete. Please try again.';}
};
if(window.self!==window.top){
  const mount=document.getElementById('otpless-login-page');
  mount.innerHTML='<p>Google sign-in needs the full website. Open Ranisa Boutique in a new tab to continue.</p><a class="btn" id="openFullSignIn" target="_blank" rel="noopener">Open website to sign in ↗</a>';
  document.getElementById('openFullSignIn').href=location.origin+'/account/alternate/'+(new URLSearchParams(location.search).get('return')==='/cart/'?'?return=%2Fcart%2F':'');
}else{
  const sdk=document.createElement('script');
  sdk.id='otpless-sdk';
  sdk.dataset.appid='CTST8DZ1XN4CDP5DKR4O';
  sdk.src='https://otpless.com/v4/auth.js';
  sdk.onerror=()=>{managedStatus.textContent='Sign-in could not load. Refresh this page or try another browser.';};
  document.head.append(sdk);
}
