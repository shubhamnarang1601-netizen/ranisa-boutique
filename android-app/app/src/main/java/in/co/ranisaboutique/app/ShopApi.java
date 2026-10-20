package in.co.ranisaboutique.app;
import org.json.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
final class ShopApi {
 static final String SITE="https://ranisaboutique.co.in";
 static final String MOBILE="/functions/v1/ranisa-mobile";
 static JSONObject object(Object... values){JSONObject o=new JSONObject();try{for(int i=0;i<values.length;i+=2)o.put((String)values[i],values[i+1]);}catch(JSONException e){throw new IllegalArgumentException(e);}return o;}
 static String read(InputStream in)throws IOException{
  if(in==null)return "";try(InputStream source=in;ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] b=new byte[8192];int n;while((n=source.read(b))!=-1){if(out.size()+n>8*1024*1024)throw new IOException("Response too large");out.write(b,0,n);}return new String(out.toByteArray(),StandardCharsets.UTF_8);}
 }
 static Object request(String method,String path,JSONObject body,String token)throws Exception{
  HttpURLConnection c=(HttpURLConnection)new URL(GoogleAuth.BASE+path).openConnection();c.setConnectTimeout(15000);c.setReadTimeout(25000);
  c.setRequestMethod(method);c.setRequestProperty("apikey",GoogleAuth.KEY);c.setRequestProperty("Content-Type","application/json");c.setRequestProperty("Accept","application/json");
  if(token!=null)c.setRequestProperty("Authorization","Bearer "+token);
  try{if(body!=null){c.setDoOutput(true);try(OutputStream out=c.getOutputStream()){out.write(body.toString().getBytes(StandardCharsets.UTF_8));}}
   int status=c.getResponseCode();String raw=read(status>=200&&status<300?c.getInputStream():c.getErrorStream());
   if(status<200||status>=300){String message="Could not connect. Please try again.";try{JSONObject e=new JSONObject(raw);String m=e.optString("error");if(!m.isEmpty()&&m.length()<240)message=m;}catch(Exception ignored){}
    if(status==404&&path.startsWith(MOBILE))message="Checkout is awaiting the boutique's secure payment activation. No payment has been taken.";
    if(status==401)message="Please sign in again to continue.";throw new IOException(message);}
   if(raw.isEmpty())return new JSONObject();return new JSONTokener(raw).nextValue();
  }finally{c.disconnect();}
 }
 static JSONArray catalogue()throws Exception{
  return (JSONArray)request("GET","/rest/v1/ranisa_products?select=id,name,category,fabric,description,price,image_url,gallery_images,available_sizes,badge&is_active=eq.true&order=sort_order.asc,created_at.desc",null,null);
 }
 static JSONObject commerce(JSONObject body,GoogleAuth auth)throws Exception{return (JSONObject)request("POST",MOBILE,body,auth.validToken());}
 static JSONArray orders(GoogleAuth auth)throws Exception{
  String token=auth.validToken();return (JSONArray)request("GET","/rest/v1/ranisa_orders?user_id=eq."+URLEncoder.encode(auth.userId,StandardCharsets.UTF_8.name())+"&select=id,created_at,amount,currency,paid,test_mode,items,delivery,sync_state,shipment_id,tracking&order=created_at.desc&limit=50",null,auth.validToken());
 }
 static boolean isAdmin(GoogleAuth auth)throws Exception{
  JSONArray a=(JSONArray)request("GET","/rest/v1/ranisa_admin_users?select=user_id",null,auth.validToken());return a.length()>0;
 }
 static void sizes(String id,JSONArray sizes,GoogleAuth auth)throws Exception{
  if(!id.matches("[0-9]+"))throw new IOException("Invalid product");
  request("PATCH","/rest/v1/ranisa_products?id=eq."+id,object("available_sizes",sizes),auth.validToken());
 }
}
