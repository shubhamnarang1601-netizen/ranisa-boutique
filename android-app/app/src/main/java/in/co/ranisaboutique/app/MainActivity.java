package in.co.ranisaboutique.app;
import android.app.*;
import android.os.*;
import android.graphics.*;
import android.view.*;
import android.widget.*;
import org.json.*;
import java.net.*;
import java.io.*;
import java.util.*;
import java.util.concurrent.*;

public class MainActivity extends Activity {
 final int wine=Color.rgb(112,30,57),gold=Color.rgb(163,126,59);
 final ExecutorService workers=Executors.newFixedThreadPool(3);
 GoogleAuth auth; String authMessage="";
 LinearLayout root,body,nav; final ArrayList<JSONObject> products=new ArrayList<>();
 Set<String> saved=new HashSet<>(); String tab="Home",category="All"; boolean loading=true; String error="";
 final String site="https://ranisaboutique.co.in";
 @Override public void onCreate(Bundle b){super.onCreate(b); auth=new GoogleAuth(this); saved=new HashSet<>(getPreferences(0).getStringSet("wishlist",Collections.emptySet())); render(); load(); handleAuthIntent(getIntent());}
 TextView text(String value,int size,int color){TextView v=new TextView(this);v.setText(value);v.setTextSize(size);v.setTextColor(color);v.setPadding(12,12,12,12);return v;}
 Button button(String label,Runnable action){Button b=new Button(this);b.setText(label);b.setTextColor(wine);b.setOnClickListener(v->action.run());return b;}
 void render(){
 root=new LinearLayout(this);root.setOrientation(1);root.setBackgroundColor(Color.WHITE);
 root.setPadding(0,0,0,8);setContentView(root);
 root.setOnApplyWindowInsetsListener((v,i)->{root.setPadding(i.getSystemWindowInsetLeft(),i.getSystemWindowInsetTop(),i.getSystemWindowInsetRight(),i.getSystemWindowInsetBottom());return i;});
 TextView title=text("RANISA BOUTIQUE",23,wine);title.setGravity(Gravity.CENTER);root.addView(title);
 TextView note=text("FREE SHIPPING ACROSS INDIA",11,gold);note.setGravity(Gravity.CENTER);root.addView(note);
 ScrollView scroll=new ScrollView(this);body=new LinearLayout(this);body.setOrientation(1);scroll.addView(body);
 root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
 nav=new LinearLayout(this);
 for(String name:new String[]{"Home","Categories","Wishlist","Bag","Profile"}){
  TextView item=text(name,11,tab.equals(name)?wine:Color.DKGRAY); item.setGravity(Gravity.CENTER);item.setContentDescription(name+" tab");
  item.setOnClickListener(v->{tab=name;render();});nav.addView(item,new LinearLayout.LayoutParams(0,-2,1));
 }root.addView(nav);
 if(tab.equals("Bag")){body.addView(text("Your bag",25,wine));body.addView(text("Checkout will be available after Google sign-in and payment integration are verified.",16,Color.DKGRAY));return;}
 if(tab.equals("Profile")){body.addView(text("Your Ranisa account",25,wine));if(!authMessage.isEmpty())body.addView(text(authMessage,16,wine));if(!auth.email.isEmpty()){body.addView(text(auth.email,16,Color.DKGRAY));body.addView(button("Sign out",()->auth.signOut(this::authResult)));}else{body.addView(text("Sign in to manage your account and place orders.",16,Color.DKGRAY));body.addView(button("Continue with Google",()->auth.start(this::authResult)));}return;}
 LinearLayout cats=new LinearLayout(this);
 HorizontalScrollView h=new HorizontalScrollView(this);h.addView(cats);body.addView(h);
 for(String c:new String[]{"All","suit","lehenga","material"})cats.addView(button(c,()->{category=c;render();}));
 body.addView(text(tab.equals("Wishlist")?"Your wishlist":"Discover your style",24,wine));
 if(loading){body.addView(text("Loading boutique collection…",16,gold));return;}
 if(!error.isEmpty()){body.addView(text(error,16,Color.DKGRAY));body.addView(button("Retry",()->{loading=true;error="";render();load();}));return;}
 LinearLayout row=null;int count=0;
 for(JSONObject p:products){
  if(!category.equals("All")&&!category.equals(p.optString("category")))continue;
  if(tab.equals("Wishlist")&&!saved.contains(p.optString("id")))continue;
  if(count%2==0){row=new LinearLayout(this);body.addView(row);}count++;
  LinearLayout card=new LinearLayout(this);card.setPadding(8,8,8,16);card.setOrientation(1);
  row.addView(card,new LinearLayout.LayoutParams(0,-2,1));
  ImageView photo=new ImageView(this);photo.setScaleType(ImageView.ScaleType.CENTER_CROP);photo.setBackgroundColor(0xfff4eeee);photo.setContentDescription(p.optString("name"));
  card.addView(photo,new LinearLayout.LayoutParams(-1,(int)(230*getResources().getDisplayMetrics().density)));image(p.optString("imageUrl"),photo);
  card.addView(text(p.optString("name"),16,wine));card.addView(text("₹"+p.optString("price"),15,Color.BLACK));
  photo.setOnClickListener(v->detail(p));
  String id=p.optString("id");
  card.addView(button(saved.contains(id)?"Saved ♥":"Wishlist ♡",()->{if(!saved.add(id))saved.remove(id);getPreferences(0).edit().putStringSet("wishlist",new HashSet<>(saved)).apply();render();}));
 }
 if(count==0)body.addView(text(tab.equals("Wishlist")?"Your saved pieces will appear here.":"No available products in this collection.",16,Color.DKGRAY));
 }
 void detail(JSONObject p){
 new AlertDialog.Builder(this).setTitle(p.optString("name")).setMessage(p.optString("description")+"\n\n₹"+p.optString("price")+"\nFree shipping across India\nNo Return, No Exchange\n\nAvailable sizes will be shown once verified in the shared catalogue.").setPositiveButton("Close",null).show();
 }
 HttpURLConnection connection(String source)throws Exception{
 URL u=new URL(source);if(!"https".equals(u.getProtocol()))throw new IOException("HTTPS required");
 HttpURLConnection c=(HttpURLConnection)u.openConnection();c.setConnectTimeout(15000);c.setReadTimeout(15000);return c;
 }
 void load(){workers.execute(()->{HttpURLConnection c=null;try{
 c=connection(site+"/api/products"); if(c.getResponseCode()!=200)throw new IOException();
 String json;try(InputStream in=c.getInputStream()){ByteArrayOutputStream bytes=new ByteArrayOutputStream();byte[] buffer=new byte[8192];int n;while((n=in.read(buffer))!=-1)bytes.write(buffer,0,n);json=new String(bytes.toByteArray(),java.nio.charset.StandardCharsets.UTF_8);}
 JSONObject result=new JSONObject(json);if(result.has("error"))throw new IOException();
 JSONArray list=result.getJSONArray("products");ArrayList<JSONObject> fresh=new ArrayList<>();
 for(int i=0;i<list.length();i++)fresh.add(list.getJSONObject(i));
 runOnUiThread(()->{products.clear();products.addAll(fresh);loading=false;render();});
 }catch(Exception e){runOnUiThread(()->{loading=false;error="The boutique catalogue could not be loaded. Please try again.";render();});}finally{if(c!=null)c.disconnect();}});}
 void image(String source,ImageView view){if(source.isEmpty())return;workers.execute(()->{HttpURLConnection c=null;try{
 String url=source.startsWith("/")?site+source:source;c=connection(url);
 Bitmap bitmap;try(InputStream in=c.getInputStream()){BitmapFactory.Options o=new BitmapFactory.Options();o.inSampleSize=2;bitmap=BitmapFactory.decodeStream(in,null,o);}
 if(bitmap!=null)runOnUiThread(()->view.setImageBitmap(bitmap));
 }catch(Exception ignored){}finally{if(c!=null)c.disconnect();}});}
 void authResult(String message){authMessage=message;tab="Profile";render();}
 void handleAuthIntent(android.content.Intent intent){if(intent!=null)auth.handle(intent.getData(),this::authResult);}
 @Override protected void onNewIntent(android.content.Intent intent){super.onNewIntent(intent);setIntent(intent);handleAuthIntent(intent);}
 @Override public void onDestroy(){workers.shutdownNow();super.onDestroy();}
}
