const accountKey='ranisaCustomerEmailSession';
const el=id=>document.getElementById(id);
let accountSession=null,pendingEmail='',resendTimer=null;
function show(id){for(const name of ['accountStart','accountVerify','accountSignedIn'])el(name).hidden=name!==id;}
function message(id,text,error=false){const node=el(id);node.textContent=text;node.classList.toggle('error',error);}
function storeSession(value){accountSession=value;if(value)sessionStorage.setItem(accountKey,JSON.stringify(value));else sessionStorage.removeItem(accountKey);showAccountLink();}
function normalizeEmail(value){const email=value.trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)throw new Error('Enter a valid email address.');return email;}
async function authRequest(path,body,token){const response=await fetch(RANISA_DB+'/auth/v1/'+path,{method:'POST',headers:{apikey:RANISA_KEY,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body||{})});let payload={};try{payload=await response.json();}catch{}if(!response.ok)throw new Error(payload.msg||payload.error_description||payload.message||payload.error||'Unable to complete the request. Please try again.');return payload;}
function signedIn(){if(!accountSession?.user?.email){storeSession(null);show('accountStart');return;}el('currentEmail').textContent=accountSession.user.email;show('accountSignedIn');}
async function restore(){try{accountSession=JSON.parse(sessionStorage.getItem(accountKey)||'null');}catch{storeSession(null);}if(!accountSession)return show('accountStart');try{if(Date.now()/1000>(accountSession.expires_at||0)-60){const refreshed=await authRequest('token?grant_type=refresh_token',{refresh_token:accountSession.refresh_token});storeSession(refreshed);}signedIn();}catch{storeSession(null);show('accountStart');}}
function cooldown(seconds=60){const button=el('resendCode');clearInterval(resendTimer);let remaining=seconds;button.disabled=true;button.textContent=`Resend in ${remaining}s`;resendTimer=setInterval(()=>{remaining--;button.textContent=remaining>0?`Resend in ${remaining}s`:'Resend code';if(remaining<=0){clearInterval(resendTimer);button.disabled=false;}},1000);}
async function sendOtp(email){await authRequest('otp',{email,create_user:true});pendingEmail=email;el('codeEmail').textContent=email;el('codeInput').value='';message('codeStatus','');show('accountVerify');cooldown();el('codeInput').focus();}
el('emailForm').onsubmit=async event=>{event.preventDefault();const button=el('sendCode');button.disabled=true;message('emailStatus','Sending code…');try{await sendOtp(normalizeEmail(el('emailInput').value));message('emailStatus','');}catch(error){message('emailStatus',error.message,true);}finally{button.disabled=false;}};
el('codeForm').onsubmit=async event=>{event.preventDefault();const button=el('verifyCode');button.disabled=true;message('codeStatus','Verifying…');try{const result=await authRequest('verify',{email:pendingEmail,token:el('codeInput').value.trim(),type:'email'});if(!result.access_token||!result.user)throw new Error('The code could not be verified. Please try again.');storeSession(result);message('codeStatus','');signedIn();}catch(error){message('codeStatus',error.message,true);}finally{button.disabled=false;}};
el('resendCode').onclick=async()=>{el('resendCode').disabled=true;message('codeStatus','Sending another code…');try{await sendOtp(pendingEmail);message('codeStatus','New code sent.');}catch(error){message('codeStatus',error.message,true);el('resendCode').disabled=false;}};
el('changeEmail').onclick=()=>{clearInterval(resendTimer);pendingEmail='';show('accountStart');};
el('accountLogout').onclick=async()=>{const token=accountSession?.access_token;storeSession(null);show('accountStart');message('emailStatus','Signed out.');if(token)try{await authRequest('logout',{},token);}catch{}};
const otplessKey='ranisaOtplessSession';
const verifyEndpoint=RANISA_DB+'/functions/v1/ranisa-otpless-verify';
async function verifyOtpless(idToken){
  const response=await fetch(verifyEndpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:RANISA_KEY},body:JSON.stringify({idToken})});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||'Could not verify your email.');
  return result;
}
async function startOtpless(){
  const start=el('accountStart');
  const panel=document.createElement('div');
  panel.className='account-card';
  panel.id='otplessPanel';
  panel.innerHTML='<h2>Sign in or sign up</h2><p>Continue with your Google account to sign in or join Ranisa Boutique.</p><div class="social-signin"><button class="btn" id="googleSignIn" type="button" disabled>Continue with Google</button></div><p class="account-status" id="otplessStatus" role="status">Loading sign-in…</p><p>See our <a href="/privacy/">privacy policy</a>.</p>';
  start.after(panel);
  if(window.self!==window.top){
    start.hidden=true;
    el('accountVerify').hidden=true;
    el('accountSignedIn').hidden=true;
    panel.innerHTML='<h2>Open Ranisa Boutique in a new tab</h2><p>Google sign-in needs the full website. The sign-in box may keep loading inside this preview.</p><a class="btn" id="openFullSignIn" target="_blank" rel="noopener">Open website to sign in ↗</a>';
    el('openFullSignIn').href=location.origin+'/account/'+(new URLSearchParams(location.search).get('return')==='/cart/'?'?return=%2Fcart%2F':'');
    return;
  }
  sessionStorage.removeItem(accountKey);
  start.hidden=true;
  el('accountVerify').hidden=true;
  el('accountSignedIn').hidden=true;
  const showWidget=()=>{panel.hidden=false;el('accountSignedIn').hidden=true;showAccountLink();};
  const finishPendingCart=async()=>{
    const pending=Number(sessionStorage.getItem('ranisaPendingCartProduct'));
    if(sessionStorage.getItem('ranisaPendingCartProduct')!==null&&Number.isSafeInteger(pending)&&pending>=0){
      try{await addToCartItem(pending);sessionStorage.removeItem('ranisaPendingCartProduct');location.href='/cart/';}
      catch(error){message('signedInStatus',error.message,true);}
    }else if(new URLSearchParams(location.search).get('return')==='/cart/')location.href='/cart/';
  };
  const finishSocialSignIn=async user=>{
    if(!user?.idToken){message('otplessStatus','We could not verify your sign-in. Please try again.',true);return;}
    const identity=user.identities?.find(item=>item.identityType==='EMAIL'&&item.channel==='OAUTH'&&item.verified===true&&item.methods?.some(method=>['GOOGLE','GMAIL'].includes(method)));
    if(!identity){message('otplessStatus','Use Google with a verified email address.',true);return;}
    message('otplessStatus','Verifying your email…');
    try{
      const verified=await verifyOtpless(user.idToken);
      if(verified.email!==String(identity.identityValue).toLowerCase())throw new Error('Email identity did not match. Please try again.');
      sessionStorage.setItem(otplessKey,JSON.stringify({idToken:user.idToken,expiresAt:verified.expiresAt,email:verified.email}));
      el('currentEmail').textContent=verified.email;
      panel.hidden=true;
      el('accountSignedIn').hidden=false;
      showAccountLink();
      await finishPendingCart();
    }catch(error){message('otplessStatus',error.message,true);}
  };
  el('accountLogout').onclick=()=>{
    sessionStorage.removeItem(otplessKey);
    showWidget();
    message('otplessStatus','Signed out.');
  };
  try{
    const stored=JSON.parse(sessionStorage.getItem(otplessKey)||'null');
    if(stored?.idToken&&stored.expiresAt>Date.now()/1000){
      const verified=await verifyOtpless(stored.idToken);
      el('currentEmail').textContent=verified.email;
      panel.hidden=true;
      el('accountSignedIn').hidden=false;
      showAccountLink();
      await finishPendingCart();
    }else{sessionStorage.removeItem(otplessKey);}
  }catch{sessionStorage.removeItem(otplessKey);showWidget();}
  const sdk=document.createElement('script');
  sdk.id='otpless-sdk';
  sdk.dataset.appid=window.RANISA_OTPLESS_APP_ID;
  sdk.src='https://otpless.com/v4/headless.js';
  sdk.onload=()=>{
    try{
      const auth=new OTPless(async event=>{
        if(event?.responseType==='ONETAP')await finishSocialSignIn(event.response);
        if(event?.responseType==='FAILED'||event?.success===false)message('otplessStatus',event.response?.errorMessage||'Google sign-in failed. Please try again.',true);
      });
      const options=[['googleSignIn','GMAIL']];
      for(const [id,provider] of options){
        const button=el(id);
        button.disabled=false;
        button.onclick=async()=>{
          button.disabled=true;
          message('otplessStatus','Opening Google sign-in…');
          try{
            const result=await auth.initiate({channel:'OAUTH',channelType:provider});
            if(result?.success===false)throw new Error(result.response?.errorMessage||'Sign-in is unavailable. Please try again.');
            setTimeout(()=>{
              if(!panel.hidden){
                message('otplessStatus','Complete sign-in in the Google window. If it did not open, allow pop-ups for this website and try again.');
              }
            },15000);
          }catch(error){message('otplessStatus',error.message,true);}finally{button.disabled=false;}
        };
      }
      message('otplessStatus','');
    }catch{message('otplessStatus','Social sign-in could not load. Please try again later.',true);}
  };
  sdk.onerror=()=>message('otplessStatus','Social sign-in is unavailable right now. Please try again later.',true);
  document.head.append(sdk);
}
if(window.RANISA_OTPLESS_APP_ID)startOtpless();else restore();
