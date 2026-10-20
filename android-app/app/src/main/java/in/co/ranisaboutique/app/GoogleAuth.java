package in.co.ranisaboutique.app;
import android.app.Activity;
import android.content.*;
import android.net.Uri;
import android.util.Base64;
import org.json.JSONObject;
import java.net.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.concurrent.*;

final class GoogleAuth {
 static final String BASE="https://bhfmhzwcogfbnzpdrzih.supabase.co";
 // Publishable client key; authorization is enforced by Supabase RLS.
 static final String KEY="sb_publishable_POe4-O4LRqn7I-4D_Rz8sw_mxuwHFgp";
 static final String CALLBACK="in.co.ranisaboutique.app://auth/callback";
 final Activity activity; final SharedPreferences pending;
 final ExecutorService network=Executors.newSingleThreadExecutor();
 volatile String accessToken="",refreshToken="",email=""; volatile long expiresAt=0;
 GoogleAuth(Activity a){activity=a;pending=a.getSharedPreferences("google-pkce",0);}
 interface Result { void complete(String message); }
 boolean signedIn(){return !accessToken.isEmpty() && System.currentTimeMillis()<expiresAt;}
 static String base64(byte[] bytes){return Base64.encodeToString(bytes,Base64.URL_SAFE|Base64.NO_WRAP|Base64.NO_PADDING);}
 void start(Result result){
  try{
   byte[] random=new byte[32];new SecureRandom().nextBytes(random);String verifier=base64(random);
   String challenge=base64(MessageDigest.getInstance("SHA-256").digest(verifier.getBytes(StandardCharsets.US_ASCII)));
   pending.edit().putString("verifier",verifier).putLong("started",System.currentTimeMillis()).commit();
   Uri uri=Uri.parse(BASE+"/auth/v1/authorize").buildUpon().appendQueryParameter("provider","google")
    .appendQueryParameter("redirect_to",CALLBACK).appendQueryParameter("code_challenge",challenge)
    .appendQueryParameter("code_challenge_method","s256").appendQueryParameter("scopes","openid email profile").build();
   activity.startActivity(new Intent(Intent.ACTION_VIEW,uri));
  }catch(Exception e){pending.edit().clear().apply();result.complete("Google sign-in could not open. Please try again.");}
 }
 boolean handle(Uri uri,Result result){
  if(uri==null||!"in.co.ranisaboutique.app".equals(uri.getScheme())||!"auth".equals(uri.getHost())||!"/callback".equals(uri.getPath()))return false;
  String verifier=pending.getString("verifier","");
  long started=pending.getLong("started",0);pending.edit().clear().commit();
  if(uri.getQueryParameter("error")!=null){result.complete("Google sign-in was cancelled or denied. Please try again.");return true;}
  String code=uri.getQueryParameter("code");
  if(code==null||verifier.isEmpty()||started==0||System.currentTimeMillis()-started>600000){result.complete("This sign-in expired. Please start again.");return true;}
  network.execute(()->{try{
   JSONObject request=new JSONObject().put("auth_code",code).put("code_verifier",verifier);
   accept(post("/auth/v1/token?grant_type=pkce",request,null));
   activity.runOnUiThread(()->result.complete("Signed in with Google."));
  }catch(Exception e){clear();activity.runOnUiThread(()->result.complete("Could not finish Google sign-in. Please try again."));}});
  return true;
 }
 void accept(JSONObject response)throws Exception{
  String token=response.optString("access_token"),refresh=response.optString("refresh_token");
  JSONObject user=response.optJSONObject("user");
  if(token.isEmpty()||refresh.isEmpty()||user==null)throw new IOException("Invalid session");
  accessToken=token;refreshToken=refresh;email=user.optString("email");
  expiresAt=System.currentTimeMillis()+Math.max(0,response.optLong("expires_in",0)-30)*1000;
 }
 // Call on a worker thread before protected commerce requests.
 synchronized String validToken()throws Exception{
  if(!signedIn()){
   if(refreshToken.isEmpty())throw new IOException("Sign in required");
   try{accept(post("/auth/v1/token?grant_type=refresh_token",new JSONObject().put("refresh_token",refreshToken),null));}
   catch(Exception e){clear();throw e;}
  }return accessToken;
 }
 JSONObject post(String path,JSONObject body,String token)throws Exception{
  HttpURLConnection c=(HttpURLConnection)new URL(BASE+path).openConnection();
  c.setConnectTimeout(15000);c.setReadTimeout(15000);c.setRequestMethod("POST");c.setDoOutput(true);
  c.setRequestProperty("apikey",KEY);c.setRequestProperty("Content-Type","application/json");
  if(token!=null)c.setRequestProperty("Authorization","Bearer "+token);
  try{
   try(OutputStream out=c.getOutputStream()){out.write(body.toString().getBytes(StandardCharsets.UTF_8));}
   if(c.getResponseCode()<200||c.getResponseCode()>=300)throw new IOException("Auth request failed");
   ByteArrayOutputStream bytes=new ByteArrayOutputStream();
   try(InputStream in=c.getInputStream()){byte[] buffer=new byte[4096];int n;while((n=in.read(buffer))!=-1)bytes.write(buffer,0,n);}
   return new JSONObject(new String(bytes.toByteArray(),StandardCharsets.UTF_8));
  }finally{c.disconnect();}
 }
 void signOut(Result result){
  String token=accessToken;clear();
  network.execute(()->{try{if(!token.isEmpty())post("/auth/v1/logout?scope=local",new JSONObject(),token);}catch(Exception ignored){}
   activity.runOnUiThread(()->result.complete("Signed out on this device."));});
 }
 void clear(){accessToken="";refreshToken="";email="";expiresAt=0;pending.edit().clear().apply();}
 // Sessions intentionally remain in memory; app process restart requires login.
}
