package in.co.ranisaboutique.app;
import android.app.*;
import android.os.*;
import android.content.*;
import android.net.Uri;
import android.graphics.*;
import android.graphics.drawable.GradientDrawable;
import android.text.*;
import android.view.*;
import android.view.inputmethod.InputMethodManager;
import android.widget.*;
import com.razorpay.*;
import org.json.*;
import java.util.*;
import java.util.concurrent.*;
import java.io.*;
import java.net.*;
import java.text.NumberFormat;

public class MainActivity extends Activity implements PaymentResultWithDataListener {
 final int WINE=0xff701e39,GOLD=0xff967135,INK=0xff292126,MUTED=0xff756c71,PALE=0xfff8f3f5,LINE=0xffe9e0e4;
 final ExecutorService workers=Executors.newFixedThreadPool(4);
 final android.util.LruCache<String,Bitmap> images=new android.util.LruCache<String,Bitmap>(12*1024*1024){protected int sizeOf(String k,Bitmap b){return b.getByteCount();}};
 final NumberFormat rupees=NumberFormat.getCurrencyInstance(new Locale("en","IN"));
 GoogleAuth auth; SessionVault vault; LinearLayout root,body,listing; TextView notice;
 JSONArray products=new JSONArray(),orders=new JSONArray(),bag=new JSONArray();
 Set<String> favourites=new HashSet<>();
 String screen="Home",category="All",query="",sort="Featured",message="",selectedSize="",pendingOrder="";
 JSONObject product=null,address=new JSONObject(); boolean loading=true,busy=false,admin=false;
 int generation=0;
 @Override public void onCreate(Bundle state){
  super.onCreate(state);auth=new GoogleAuth(this);vault=new SessionVault(this);
  favourites=new HashSet<>(getPreferences(0).getStringSet("favourites",Collections.emptySet()));
  loadBag();restorePrivate();Checkout.preload(getApplicationContext());render();loadCatalogue();handleIntent(getIntent());
  if(auth.hasSession())checkAdmin();
 }
 int dp(float n){return Math.round(n*getResources().getDisplayMetrics().density);}
 LinearLayout column(){LinearLayout l=new LinearLayout(this);l.setOrientation(LinearLayout.VERTICAL);return l;}
 GradientDrawable bg(int color,int radius){GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(dp(radius));return d;}
 TextView label(String s,int size,int color){TextView t=new TextView(this);t.setText(s);t.setTextSize(size);t.setTextColor(color);t.setPadding(dp(12),dp(7),dp(12),dp(7));t.setFontFeatureSettings("kern");return t;}
 TextView heading(String s){TextView t=label(s,27,INK);t.setTypeface(android.graphics.Typeface.create("serif",android.graphics.Typeface.NORMAL));return t;}
 Button button(String s,boolean primary,Runnable action){
  Button b=new Button(this);b.setText(s);b.setAllCaps(false);b.setTextSize(14);b.setTextColor(primary?Color.WHITE:WINE);b.setBackground(bg(primary?WINE:PALE,10));b.setMinHeight(dp(48));b.setPadding(dp(14),dp(8),dp(14),dp(8));
  LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.setMargins(dp(10),dp(5),dp(10),dp(5));b.setLayoutParams(p);
  b.setOnClickListener(v->{if(busy){toast("Please wait…");return;}action.run();});return b;
 }
 void spacer(int h){View v=new View(this);body.addView(v,new LinearLayout.LayoutParams(-1,dp(h)));}
 void toast(String s){Toast.makeText(this,s,Toast.LENGTH_LONG).show();}
 void info(String s){message=s;if(notice!=null){notice.setText(s);notice.setVisibility(s.isEmpty()?View.GONE:View.VISIBLE);}}
 void nav(String next){if(busy){toast("Please wait for the current request.");return;}screen=next;message="";render();if(next.equals("Orders"))loadOrders();}
 void render(){
  generation++;root=column();root.setBackgroundColor(Color.WHITE);setContentView(root);
  root.setOnApplyWindowInsetsListener((v,i)->{if(Build.VERSION.SDK_INT>=30){android.graphics.Insets x=i.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.ime());root.setPadding(x.left,x.top,x.right,x.bottom);}else root.setPadding(i.getSystemWindowInsetLeft(),i.getSystemWindowInsetTop(),i.getSystemWindowInsetRight(),i.getSystemWindowInsetBottom());return i;});root.requestApplyInsets();
  LinearLayout top=new LinearLayout(this);top.setGravity(Gravity.CENTER_VERTICAL);top.setPadding(dp(10),dp(4),dp(10),dp(4));
  if(!isTab()){TextView back=label("‹",32,WINE);back.setContentDescription("Back");back.setOnClickListener(v->goBack());top.addView(back);}
  ImageView logo=new ImageView(this);logo.setImageResource(R.drawable.brand_mark);logo.setContentDescription("Ranisa Boutique logo");logo.setScaleType(ImageView.ScaleType.FIT_CENTER);top.addView(logo,new LinearLayout.LayoutParams(dp(42),dp(48)));
  LinearLayout brand=column();TextView name=label("RANISA",20,WINE);name.setLetterSpacing(.18f);name.setTypeface(null,android.graphics.Typeface.BOLD);brand.addView(name);TextView sub=label("B O U T I Q U E",9,GOLD);sub.setPadding(dp(12),0,0,dp(4));brand.addView(sub);
  top.addView(brand,new LinearLayout.LayoutParams(0,-2,1));TextView help=label("Help",13,WINE);help.setOnClickListener(v->whatsapp("Hello Ranisa Boutique, I need assistance."));top.addView(help);root.addView(top);
  View line=new View(this);line.setBackgroundColor(LINE);root.addView(line,new LinearLayout.LayoutParams(-1,dp(1)));
  ScrollView scroll=new ScrollView(this);scroll.setFillViewport(true);body=column();body.setPadding(dp(8),dp(10),dp(8),dp(18));scroll.addView(body);root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
  notice=label(message,14,WINE);notice.setBackground(bg(PALE,8));notice.setVisibility(message.isEmpty()?View.GONE:View.VISIBLE);notice.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);body.addView(notice);
  switch(screen){
   case "Home":case "Categories":case "Wishlist":catalogueScreen();break;
   case "Product":productScreen();break;
   case "Bag":bagScreen();break;
   case "Checkout":checkoutScreen();break;
   case "Custom":customScreen();break;
   case "Profile":profileScreen();break;
   case "Orders":ordersScreen();break;
   case "Policies":policiesScreen();break;
   case "Admin":adminScreen();break;
   default:catalogueScreen();
  }bottom();
 }
 boolean isTab(){return Arrays.asList("Home","Categories","Wishlist","Bag","Profile").contains(screen);}
 void bottom(){
  LinearLayout bar=new LinearLayout(this);bar.setElevation(dp(8));bar.setBackgroundColor(Color.WHITE);bar.setPadding(0,dp(7),0,dp(5));
  String[] tabs={"Home","Categories","Wishlist","Bag","Profile"};
  for(int i=0;i<tabs.length;i++){final String t=tabs[i];LinearLayout item=column();item.setGravity(Gravity.CENTER);item.setContentDescription(t+" tab");item.setClickable(true);item.setFocusable(true);item.setOnClickListener(v->nav(t));
   int color=screen.equals(t)?WINE:MUTED;item.addView(new NavIcon(this,i,color),new LinearLayout.LayoutParams(dp(25),dp(25)));
   TextView title=label(t.equals("Bag")&&bag.length()>0?"Bag ("+bag.length()+")":t,10,color);title.setPadding(0,dp(3),0,0);item.addView(title);bar.addView(item,new LinearLayout.LayoutParams(0,dp(51),1));}root.addView(bar);
 }
 void catalogueScreen(){
  body.addView(label("COMPLIMENTARY SHIPPING · INDIA",10,GOLD));body.addView(heading(screen.equals("Wishlist")?"Your favourites":screen.equals("Categories")?"Shop by category":"Made for your moments"));
  EditText search=new EditText(this);search.setSingleLine(true);search.setHint("Search suits, lehengas, fabrics…");search.setText(query);search.setTextSize(14);search.setTextColor(INK);search.setBackground(bg(PALE,10));search.setPadding(dp(16),dp(12),dp(16),dp(12));body.addView(search);
  LinearLayout chips=new LinearLayout(this);HorizontalScrollView hs=new HorizontalScrollView(this);hs.setHorizontalScrollBarEnabled(false);hs.addView(chips);body.addView(hs);
  for(String c:new String[]{"All","suit","lehenga","material"}){TextView chip=label(categoryName(c),13,category.equals(c)?Color.WHITE:WINE);chip.setBackground(bg(category.equals(c)?WINE:PALE,18));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-2,dp(40));p.setMargins(dp(3),dp(12),dp(4),dp(10));chips.addView(chip,p);chip.setGravity(Gravity.CENTER);chip.setOnClickListener(v->{category=c;render();});}
  LinearLayout sorting=new LinearLayout(this);String[] options={"Featured","Price: low to high","Price: high to low","Name A–Z"};
  TextView caption=label("The Ranisa edit",13,MUTED);sorting.addView(caption,new LinearLayout.LayoutParams(0,-2,1));Spinner spinner=new Spinner(this);spinner.setAdapter(new ArrayAdapter<>(this,android.R.layout.simple_spinner_dropdown_item,options));spinner.setSelection(Arrays.asList(options).indexOf(sort));sorting.addView(spinner,new LinearLayout.LayoutParams(dp(185),dp(40)));body.addView(sorting);
  listing=column();body.addView(listing);
  search.addTextChangedListener(new TextWatcher(){public void beforeTextChanged(CharSequence s,int st,int c,int a){}public void onTextChanged(CharSequence s,int st,int before,int c){query=s.toString();drawProducts();}public void afterTextChanged(Editable e){}});
  spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener(){public void onItemSelected(AdapterView<?> p,View v,int pos,long id){sort=options[pos];drawProducts();}public void onNothingSelected(AdapterView<?> p){}});
  drawProducts();
 }
 String categoryName(String c){switch(c){case "suit":return "Suits";case "lehenga":return "Lehengas";case "material":return "Dress materials";default:return "All";}}
 void drawProducts(){
  if(listing==null)return;listing.removeAllViews();
  if(loading){listing.addView(label("Loading your boutique collection…",16,MUTED));return;}
  List<JSONObject> filtered=new ArrayList<>();
  for(int i=0;i<products.length();i++){JSONObject p=products.optJSONObject(i);if(p==null)continue;
   if(!category.equals("All")&&!category.equals(p.optString("category")))continue;
   if(screen.equals("Wishlist")&&!favourites.contains(p.optString("id")))continue;
   if(!(p.optString("name")+" "+p.optString("fabric")+" "+p.optString("description")).toLowerCase(Locale.ROOT).contains(query.toLowerCase(Locale.ROOT)))continue;filtered.add(p);
  }
  if(sort.equals("Price: low to high"))filtered.sort(Comparator.comparingDouble(p->p.optDouble("price")));
  if(sort.equals("Price: high to low"))filtered.sort((a,b)->Double.compare(b.optDouble("price"),a.optDouble("price")));
  if(sort.equals("Name A–Z"))filtered.sort((a,b)->a.optString("name").compareToIgnoreCase(b.optString("name")));
  if(filtered.isEmpty()){
   LinearLayout empty=column();empty.setPadding(dp(16),dp(30),dp(16),dp(30));empty.setBackground(bg(PALE,16));empty.addView(heading(screen.equals("Wishlist")?"Save something beautiful":"Your next favourite awaits"));
   empty.addView(label(screen.equals("Wishlist")?"Tap the heart on any style to save it here.":products.length()==0?"Our catalogue will appear here as the boutique adds its pieces.":"Try another category or search.",15,MUTED));
   empty.addView(button("Custom design enquiry",true,()->{product=null;nav("Custom");}));empty.addView(button("Refresh collection",false,this::loadCatalogue));listing.addView(empty);return;
  }
  listing.addView(label(filtered.size()+" styles",12,MUTED));
  LinearLayout row=null;
  for(int i=0;i<filtered.size();i++){JSONObject p=filtered.get(i);if(i%2==0){row=new LinearLayout(this);listing.addView(row);}LinearLayout card=column();card.setPadding(dp(4),dp(5),dp(4),dp(12));row.addView(card,new LinearLayout.LayoutParams(0,-2,1));
   ImageView photo=photo(p.optString("image_url"),p.optString("name"));int width=(getResources().getDisplayMetrics().widthPixels-dp(36))/2;card.addView(photo,new LinearLayout.LayoutParams(-1,(int)(width*1.3)));
   photo.setOnClickListener(v->openProduct(p));
   String badge=p.optString("badge");if(!badge.isEmpty())card.addView(label(badge.toUpperCase(Locale.ROOT),9,GOLD));
   TextView name=label(p.optString("name"),15,INK);name.setMaxLines(2);name.setOnClickListener(v->openProduct(p));card.addView(name);
   card.addView(label(p.optString("fabric"),11,MUTED));card.addView(label(money(p.optDouble("price")),16,WINE));
   String id=p.optString("id");TextView heart=label(favourites.contains(id)?"♥ Saved":"♡ Save",13,WINE);heart.setOnClickListener(v->{toggleFavourite(id);heart.setText(favourites.contains(id)?"♥ Saved":"♡ Save");if(screen.equals("Wishlist"))drawProducts();});card.addView(heart);
  }
 }
 void openProduct(JSONObject p){product=p;selectedSize="";nav("Product");}
 void productScreen(){
  if(product==null){nav("Home");return;}JSONObject p=product;
  JSONArray gallery=p.optJSONArray("gallery_images");LinkedHashSet<String> urls=new LinkedHashSet<>();if(!p.optString("image_url").isEmpty())urls.add(p.optString("image_url"));if(gallery!=null)for(int i=0;i<gallery.length();i++)if(!gallery.optString(i).isEmpty())urls.add(gallery.optString(i));
  if(!urls.isEmpty()){HorizontalScrollView galleryView=new HorizontalScrollView(this);galleryView.setHorizontalScrollBarEnabled(true);LinearLayout strip=new LinearLayout(this);galleryView.addView(strip);int width=getResources().getDisplayMetrics().widthPixels-dp(32);
   for(String url:urls){ImageView photo=photo(url,p.optString("name")+" product photo");strip.addView(photo,new LinearLayout.LayoutParams(width,(int)(width*1.25)));photo.setOnClickListener(v->fullImage(url));}body.addView(galleryView);body.addView(label("Swipe photos · Tap to view full image",11,MUTED));}
  body.addView(label(categoryName(p.optString("category")).toUpperCase(Locale.ROOT),11,GOLD));body.addView(heading(p.optString("name")));body.addView(label(money(p.optDouble("price")),25,WINE));body.addView(label("Free delivery across India · Online payment",12,MUTED));
  body.addView(label(p.optString("description"),15,INK));if(!p.optString("fabric").isEmpty())body.addView(label("Fabric: "+p.optString("fabric"),14,MUTED));
  body.addView(label("Select size",17,INK));JSONArray sizes=p.optJSONArray("available_sizes");
  if(sizes==null||sizes.length()==0){body.addView(label("Sizing is available on enquiry for this piece.",14,MUTED));body.addView(button("Ask about this piece",true,()->{nav("Custom");}));}
  else{
   RadioGroup group=new RadioGroup(this);group.setOrientation(LinearLayout.VERTICAL);
   for(int i=0;i<sizes.length();i++){String size=sizes.optString(i);RadioButton radio=new RadioButton(this);radio.setText(size);radio.setTextColor(INK);radio.setId(View.generateViewId());radio.setChecked(selectedSize.equals(size));radio.setOnCheckedChangeListener((v,checked)->{if(checked)selectedSize=size;});group.addView(radio);}body.addView(group);
   body.addView(button("Add to bag",true,()->{if(selectedSize.isEmpty()){info("Please select a size.");return;}if(selectedSize.equals("Custom Size")){nav("Custom");return;}addBag(p,selectedSize);toast("Added to your bag");nav("Bag");}));
   body.addView(button("Custom measurements",false,()->nav("Custom")));
  }
  body.addView(button(favourites.contains(p.optString("id"))?"♥ Saved to wishlist":"♡ Save to wishlist",false,()->{toggleFavourite(p.optString("id"));render();}));
  body.addView(label("No Return, No Exchange. Please confirm size and product details before ordering.",13,MUTED));
  body.addView(button("View boutique policies",false,()->nav("Policies")));
 }
 void fullImage(String url){Dialog d=new Dialog(this,android.R.style.Theme_Material_Light_NoActionBar_Fullscreen);LinearLayout layout=column();layout.setBackgroundColor(INK);ImageView image=photo(url,"Full product photograph");image.setScaleType(ImageView.ScaleType.FIT_CENTER);layout.addView(image,new LinearLayout.LayoutParams(-1,0,1));Button close=button("Close",false,d::dismiss);layout.addView(close);d.setContentView(layout);d.show();}
 void toggleFavourite(String id){if(!favourites.add(id))favourites.remove(id);getPreferences(0).edit().putStringSet("favourites",new HashSet<>(favourites)).apply();}
 String bagKey(){return auth.hasSession()?"bag:"+auth.userId:"bag:guest";}
 void loadBag(){try{bag=new JSONArray(getPreferences(0).getString(bagKey(),"[]"));}catch(Exception e){bag=new JSONArray();}}
 void saveBag(){getPreferences(0).edit().putString(bagKey(),bag.toString()).apply();}
 JSONObject findProduct(String id){for(int i=0;i<products.length();i++){JSONObject p=products.optJSONObject(i);if(p!=null&&p.optString("id").equals(id))return p;}return null;}
 void addBag(JSONObject p,String size){for(int i=0;i<bag.length();i++){JSONObject item=bag.optJSONObject(i);if(item.optString("product_id").equals(p.optString("id"))&&size.equals(item.optString("size"))){try{item.put("quantity",Math.min(20,item.optInt("quantity")+1));}catch(Exception ignored){}saveBag();return;}}
  bag.put(ShopApi.object("product_id",p.optInt("id"),"size",size,"quantity",1));saveBag();
 }
 void removeBag(int index){bag.remove(index);saveBag();render();}
 void bagScreen(){
  body.addView(heading("Your shopping bag"));
  if(bag.length()==0){body.addView(label("A little space for something lovely.",16,MUTED));body.addView(button("Explore the collection",true,()->nav("Home")));return;}
  if(!pendingOrder.isEmpty()){body.addView(label("You have a payment awaiting confirmation.",14,WINE));body.addView(button("Check payment status",true,()->recover(pendingOrder)));return;}
  double total=0;boolean invalid=false;
  for(int i=0;i<bag.length();i++){final int index=i;JSONObject item=bag.optJSONObject(i),p=findProduct(item.optString("product_id"));LinearLayout card=column();card.setBackground(bg(PALE,12));body.addView(card);
   if(p==null){invalid=true;card.addView(label("This piece is no longer available.",15,WINE));card.addView(button("Remove",false,()->removeBag(index)));continue;}
   ImageView photo=photo(p.optString("image_url"),p.optString("name"));card.addView(photo,new LinearLayout.LayoutParams(-1,dp(160)));photo.setOnClickListener(v->openProduct(p));
   card.addView(label(p.optString("name"),18,INK));card.addView(label("Size: "+item.optString("size")+" · "+money(p.optDouble("price")),14,MUTED));
   if(!contains(p.optJSONArray("available_sizes"),item.optString("size"))){invalid=true;card.addView(label("Selected size is no longer available. Remove this item and choose again.",13,WINE));}
   int quantity=item.optInt("quantity",1);total+=quantity*p.optDouble("price");
   LinearLayout controls=new LinearLayout(this);controls.addView(button("−",false,()->changeQty(index,-1)),new LinearLayout.LayoutParams(0,dp(48),1));TextView qty=label(String.valueOf(quantity),16,INK);qty.setGravity(Gravity.CENTER);controls.addView(qty,new LinearLayout.LayoutParams(0,dp(48),1));controls.addView(button("+",false,()->changeQty(index,1)),new LinearLayout.LayoutParams(0,dp(48),1));controls.addView(button("Remove",false,()->removeBag(index)),new LinearLayout.LayoutParams(0,dp(48),2));card.addView(controls);spacer(10);
  }
  body.addView(label("Shipping                                     FREE",14,GOLD));body.addView(heading("Total  "+money(total)));body.addView(label("No Return, No Exchange",12,MUTED));
  if(!invalid)body.addView(button(auth.hasSession()?"Continue to delivery":"Sign in to checkout",true,()->{if(auth.hasSession())nav("Checkout");else signIn("Checkout");}));
 }
 void changeQty(int index,int delta){JSONObject item=bag.optJSONObject(index);int n=item.optInt("quantity")+delta;if(n<1){removeBag(index);return;}if(n>20){toast("Maximum 20 per size.");return;}try{item.put("quantity",n);}catch(Exception ignored){}saveBag();render();}
 void restorePrivate(){try{String data=vault.read("address:"+auth.email);if(!data.isEmpty())address=new JSONObject(data);pendingOrder=vault.read("pending:"+auth.email);}catch(Exception ignored){address=new JSONObject();pendingOrder="";}}
 EditText field(String title,String hint,String value,int type,LinearLayout into){
  into.addView(label(title,13,MUTED));EditText input=new EditText(this);input.setHint(hint);input.setText(value);input.setTextSize(15);input.setTextColor(INK);input.setInputType(type);input.setPadding(dp(14),dp(12),dp(14),dp(12));input.setBackground(bg(PALE,9));LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(-1,-2);lp.setMargins(dp(10),0,dp(10),dp(8));into.addView(input,lp);return input;
 }
 String value(EditText input){return input.getText().toString().trim();}
 void checkoutScreen(){
  body.addView(heading("Delivery details"));body.addView(label("India only · Free shipping · Secure Razorpay payment",12,GOLD));
  if(!auth.hasSession()){body.addView(button("Continue with Google",true,()->signIn("Checkout")));return;}
  EditText name=field("Full name","Recipient name",address.optString("name"),1,body);
  EditText phone=field("Mobile number (+91 fixed)","10-digit Indian mobile",address.optString("phone"),android.text.InputType.TYPE_CLASS_PHONE,body);phone.setFilters(new InputFilter[]{new InputFilter.LengthFilter(10)});
  EditText line1=field("Address","House, street and locality",address.optString("address"),1,body);
  EditText line2=field("Landmark (optional)","Nearby landmark",address.optString("address2"),1,body);
  EditText pin=field("PIN code","6-digit PIN",address.optString("pincode"),android.text.InputType.TYPE_CLASS_NUMBER,body);pin.setFilters(new InputFilter[]{new InputFilter.LengthFilter(6)});
  EditText city=field("City","City",address.optString("city"),1,body);EditText state=field("State / Union territory","State",address.optString("state"),1,body);
  CheckBox agree=new CheckBox(this);agree.setText("I have checked my size and agree to the boutique policies (No Return, No Exchange).");agree.setTextColor(INK);body.addView(agree);body.addView(button("Read policies",false,()->nav("Policies")));
  body.addView(button("Pay securely with Razorpay",true,()->{
   if(value(name).length()<2){name.setError("Enter full name");return;}
   if(!value(phone).matches("[6-9][0-9]{9}")){phone.setError("Enter a valid 10-digit Indian mobile");return;}
   if(value(line1).length()<5){line1.setError("Enter a complete address");return;}
   if(!value(pin).matches("[1-9][0-9]{5}")){pin.setError("Enter a valid PIN code");return;}
   if(value(city).length()<2||value(state).length()<2){info("Please enter city and state.");return;}
   if(!agree.isChecked()){info("Please confirm the boutique policies.");return;}
   address=ShopApi.object("name",value(name),"phone",value(phone),"address",value(line1),"address2",value(line2),"pincode",value(pin),"city",value(city),"state",value(state));
   try{vault.write("address:"+auth.email,address.toString());}catch(Exception e){info("Could not save delivery details securely.");return;}
   hideKeyboard();startPayment();
  }));
 }
 String afterLogin="Profile";
 void signIn(String target){afterLogin=target;info("");auth.start(this::authResult);}
 void authResult(String result){
  if(auth.hasSession()){JSONArray guest;try{guest=new JSONArray(getPreferences(0).getString("bag:guest","[]"));}catch(Exception e){guest=new JSONArray();}
   loadBag();for(int i=0;i<guest.length();i++){JSONObject item=guest.optJSONObject(i);boolean exists=false;for(int j=0;j<bag.length();j++)if(bag.optJSONObject(j).optString("product_id").equals(item.optString("product_id"))&&bag.optJSONObject(j).optString("size").equals(item.optString("size")))exists=true;if(!exists)bag.put(item);}
   saveBag();getPreferences(0).edit().remove("bag:guest").apply();restorePrivate();screen=afterLogin;message=result;render();checkAdmin();if(screen.equals("Orders"))loadOrders();
  }else{message=result;screen="Profile";render();}
 }
 void startPayment(){
  if(bag.length()==0){info("Your bag is empty.");return;}
  if(!pendingOrder.isEmpty()){recover(pendingOrder);return;}
  final JSONArray items;try{items=new JSONArray(bag.toString());}catch(Exception e){return;}
  task("Preparing secure checkout…",()->ShopApi.commerce(ShopApi.object("action","create-order","items",items,"delivery",address),auth),result->{
   JSONObject order=(JSONObject)result;pendingOrder=order.optString("order_id");try{vault.write("pending:"+auth.email,pendingOrder);}catch(Exception e){info("Could not save checkout safely. No payment has been opened.");return;}
   try{Checkout checkout=new Checkout();checkout.setKeyID(order.getString("key_id"));checkout.setImage(R.drawable.brand_mark);
    JSONObject options=ShopApi.object("name","Ranisa Boutique","description","Boutique order · Free shipping","order_id",pendingOrder,"amount",order.getLong("amount"),"currency","INR","prefill",ShopApi.object("email",auth.email,"contact","+91"+address.optString("phone")),"theme",ShopApi.object("color","#701E39"));
    checkout.open(this,options);
   }catch(Exception e){info("Payment could not open. Check its status in My Orders before retrying.");}
  });
 }
 @Override public void onPaymentSuccess(String paymentId,PaymentData data){
  if(data==null){info("Checking payment confirmation. Open My Orders.");return;}
  task("Confirming your payment…",()->ShopApi.commerce(ShopApi.object("action","verify-payment","razorpay_order_id",data.getOrderId(),"razorpay_payment_id",data.getPaymentId(),"razorpay_signature",data.getSignature()),auth),r->paid((JSONObject)r));
 }
 @Override public void onPaymentError(int code,String response,PaymentData data){screen="Bag";message="Payment was cancelled or could not complete. Check payment status before trying again.";render();}
 void recover(String id){task("Checking payment status…",()->ShopApi.commerce(ShopApi.object("action","recover-order","order_id",id),auth),r->{JSONObject o=(JSONObject)r;if(o.optBoolean("paid"))paid(o);else{info(o.optString("message","Payment is pending."));new AlertDialog.Builder(this).setTitle("Payment not confirmed").setMessage("If money was debited, wait and check again. Start a new checkout only if the previous payment was cancelled or failed.").setPositiveButton("Keep checking",(d,w)->{}).setNegativeButton("Previous payment failed",(d,w)->{pendingOrder="";vault.remove("pending:"+auth.email);render();}).show();}});}
 void paid(JSONObject result){
  if(!result.optBoolean("paid")){info("Payment confirmation is pending. Please check My Orders.");return;}
  bag=new JSONArray();saveBag();pendingOrder="";vault.remove("pending:"+auth.email);screen="Orders";message="Payment confirmed. Thank you for shopping with Ranisa.";render();loadOrders();
 }
 void profileScreen(){
  body.addView(heading("Your Ranisa"));body.addView(label("Traditional elegance. Entirely your own.",14,GOLD));
  if(!auth.hasSession()){body.addView(label("Sign in to checkout, save delivery details and view your orders.",15,MUTED));body.addView(button("Continue with Google",true,()->signIn("Profile")));}
  else{body.addView(label(auth.email,16,INK));body.addView(button("My orders & tracking",true,()->nav("Orders")));body.addView(button("Delivery address",false,()->nav("Checkout")));if(admin)body.addView(button("Manage product sizes",false,()->nav("Admin")));body.addView(button("Sign out",false,()->auth.signOut(result->{admin=false;address=new JSONObject();pendingOrder="";loadBag();message=result;render();})));}
  body.addView(button("Custom order enquiry",false,()->{product=null;nav("Custom");}));body.addView(button("Contact the boutique",false,()->whatsapp("Hello Ranisa Boutique, I need assistance.")));body.addView(button("Policies & privacy",false,()->nav("Policies")));
  body.addView(label("Ranisa Boutique · Dehradun, India",12,MUTED));
 }
 void customScreen(){
  body.addView(heading("Made for you"));body.addView(label(product==null?"Tell us what you have in mind.":"Enquiry for "+product.optString("name"),15,GOLD));
  EditText name=field("Your name","Name","",1,body);
  EditText bust=field("Bust / chest (optional)","Measurement in inches","",android.text.InputType.TYPE_CLASS_NUMBER|android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL,body);
  EditText waist=field("Waist (optional)","Measurement in inches","",android.text.InputType.TYPE_CLASS_NUMBER|android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL,body);
  EditText hips=field("Hips (optional)","Measurement in inches","",android.text.InputType.TYPE_CLASS_NUMBER|android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL,body);
  EditText length=field("Outfit length (optional)","Measurement in inches","",android.text.InputType.TYPE_CLASS_NUMBER|android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL,body);
  EditText notes=field("Design & fit details","Colour, occasion, preferred fit and requirements","",android.text.InputType.TYPE_CLASS_TEXT|android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE,body);notes.setMinLines(3);
  body.addView(label("Measurements are in inches. The boutique will confirm design, fit, price and delivery on WhatsApp.",13,MUTED));
  body.addView(button("Continue to WhatsApp",true,()->{
   if(value(name).length()<2){name.setError("Enter your name");return;}
   if(value(notes).isEmpty()){notes.setError("Tell us your requirements");return;}
   String text="Hello Ranisa Boutique!\nCustom order enquiry\nName: "+value(name)+"\n"+(product==null?"":("Product: "+product.optString("name")+" (#"+product.optString("id")+")\n"))+"Size: Custom Size\nMeasurements (inches):\nBust/chest: "+value(bust)+"\nWaist: "+value(waist)+"\nHips: "+value(hips)+"\nOutfit length: "+value(length)+"\nRequirements: "+value(notes);
   whatsapp(text);
  }));
 }
 void ordersScreen(){
  body.addView(heading("My orders"));if(!auth.hasSession()){body.addView(button("Sign in with Google",true,()->signIn("Orders")));return;}
  body.addView(button("Refresh orders",false,this::loadOrders));
  if(orders.length()==0){body.addView(label("Your orders will appear here after checkout.",15,MUTED));return;}
  for(int i=0;i<orders.length();i++){JSONObject order=orders.optJSONObject(i);LinearLayout card=column();card.setBackground(bg(PALE,12));body.addView(card);
   card.addView(label(order.optString("id"),12,MUTED));String status=order.optBoolean("paid")?"Paid · "+(order.optString("sync_state").equals("synced")?"Shipment created":"Preparing your order"):"Payment pending";
   card.addView(label(status,17,WINE));card.addView(label(money(order.optDouble("amount")/100),20,INK));card.addView(label(order.optString("created_at").replace("T"," ").substring(0,Math.min(16,order.optString("created_at").length())),12,MUTED));
   JSONArray items=order.optJSONArray("items");if(items!=null)for(int j=0;j<items.length();j++){JSONObject item=items.optJSONObject(j);card.addView(label(item.optString("name")+" · "+item.optString("size")+" × "+item.optInt("quantity"),14,INK));}
   if(order.optBoolean("test_mode"))card.addView(label("TEST ORDER · no live shipment",12,GOLD));
   if(!order.optBoolean("paid"))card.addView(button("Check payment status",false,()->recover(order.optString("id"))));
   else card.addView(button("Track order",true,()->track(order.optString("id"))));
   card.addView(button("Get order help",false,()->whatsapp("Hello Ranisa Boutique, please help with my order "+order.optString("id"))));spacer(12);
  }
 }
 void loadOrders(){if(!auth.hasSession())return;task("Loading your orders…",()->ShopApi.orders(auth),r->{orders=(JSONArray)r;message="";if(screen.equals("Orders"))render();});}
 void track(String id){task("Getting shipment updates…",()->ShopApi.commerce(ShopApi.object("action","track","order_id",id),auth),r->{
  JSONObject result=(JSONObject)r;JSONObject tracking=result.optJSONObject("tracking");StringBuilder text=new StringBuilder(result.optString("message"));
  if(tracking!=null){JSONObject data=tracking.optJSONObject("tracking_data");if(data!=null){JSONArray states=data.optJSONArray("shipment_track");if(states!=null&&states.length()>0){JSONObject current=states.optJSONObject(0);text.append("\n").append(current.optString("current_status")).append("\nAWB: ").append(current.optString("awb_code")).append("\nCourier: ").append(current.optString("courier_name"));}
    JSONArray activity=data.optJSONArray("shipment_track_activities");if(activity!=null)for(int i=0;i<Math.min(12,activity.length());i++){JSONObject a=activity.optJSONObject(i);text.append("\n\n").append(a.optString("date")).append("\n").append(a.optString("activity")).append(" · ").append(a.optString("location"));}}}
  if(text.toString().trim().isEmpty())text.append("Your shipment is being prepared. Updates will appear after courier processing.");
  new AlertDialog.Builder(this).setTitle("Order tracking").setMessage(text.toString()).setPositiveButton("Close",null).show();
 });}
 void policiesScreen(){
  body.addView(heading("Boutique policies"));body.addView(label("No Return, No Exchange",20,WINE));body.addView(label("Please check product details and confirm your size before placing an order. Contact Ranisa Boutique for product or order assistance.",15,INK));
  body.addView(label("Payments & delivery",20,WINE));body.addView(label("Online payment through Razorpay. Free shipping across India, subject to courier serviceability. Custom orders are confirmed directly with the boutique.",15,INK));
  body.addView(label("Privacy",20,WINE));body.addView(label("Google sign-in provides your account identity. Delivery details are used to fulfil your order and are shared with the payment and delivery providers where required. Your account session and saved address are encrypted on this device. Custom enquiry details open in WhatsApp only when you choose to continue.",15,INK));
  body.addView(button("Website privacy & terms",false,()->openUrl(ShopApi.SITE+"/policies")));
  body.addView(button("Account / data deletion request",false,()->whatsapp("Hello Ranisa Boutique, I would like to request deletion of my account and personal data. My account email is "+auth.email)));
 }
 void adminScreen(){body.addView(heading("Available product sizes"));if(!admin){body.addView(label("Administrator access required.",15,MUTED));return;}
  body.addView(label("These sizing options are shared with the product catalogue. Add products and images through your website admin.",14,MUTED));
  for(int i=0;i<products.length();i++){JSONObject p=products.optJSONObject(i);body.addView(button(p.optString("name"),false,()->editSizes(p)));}
 }
 void editSizes(JSONObject p){String[] options={"XS","S","M","L","XL","XXL","Unstitched","Custom Size"};boolean[] checked=new boolean[options.length];for(int i=0;i<options.length;i++)checked[i]=contains(p.optJSONArray("available_sizes"),options[i]);
  new AlertDialog.Builder(this).setTitle("Sizes · "+p.optString("name")).setMultiChoiceItems(options,checked,(d,i,c)->checked[i]=c).setNegativeButton("Cancel",null).setPositiveButton("Save",(d,w)->{
   JSONArray sizes=new JSONArray();for(int i=0;i<options.length;i++)if(checked[i])sizes.put(options[i]);
   task("Saving available sizes…",()->{ShopApi.sizes(p.optString("id"),sizes,auth);return ShopApi.object("ok",true);},r->{toast("Sizes updated");loadCatalogue();});
  }).show();
 }
 interface Work{Object run()throws Exception;} interface Done{void accept(Object result);}
 void task(String status,Work work,Done done){
  if(busy){toast("Please wait…");return;}busy=true;info(status);
  workers.execute(()->{try{Object result=work.run();runOnUiThread(()->{if(isFinishing()||isDestroyed())return;busy=false;info("");done.accept(result);});}catch(Exception e){runOnUiThread(()->{if(isFinishing()||isDestroyed())return;busy=false;loading=false;if(listing!=null&&(screen.equals("Home")||screen.equals("Categories")||screen.equals("Wishlist")))drawProducts();info(e.getMessage()==null?"Could not connect. Please try again.":e.getMessage());});}});
 }
 void loadCatalogue(){loading=true;if(isTab()&&!screen.equals("Bag")&&!screen.equals("Profile"))render();task("Refreshing the boutique collection…",()->ShopApi.catalogue(),r->{products=(JSONArray)r;loading=false;info("");render();});}
 void checkAdmin(){workers.execute(()->{try{boolean allowed=ShopApi.isAdmin(auth);runOnUiThread(()->{admin=allowed;if(screen.equals("Profile"))render();});}catch(Exception ignored){}});}
 boolean contains(JSONArray a,String value){if(a==null)return false;for(int i=0;i<a.length();i++)if(value.equals(a.optString(i)))return true;return false;}
 String money(double price){return rupees.format(price);}
 ImageView photo(String source,String description){ImageView view=new ImageView(this);view.setContentDescription(description);view.setScaleType(ImageView.ScaleType.CENTER_CROP);view.setBackground(bg(PALE,12));view.setClipToOutline(true);if(source.isEmpty())return view;
  String url=source.startsWith("/")?ShopApi.SITE+source:source;view.setTag(url);Bitmap cached=images.get(url);if(cached!=null){view.setImageBitmap(cached);return view;}
  workers.execute(()->{HttpURLConnection c=null;try{URL target=new URL(url);if(!"https".equals(target.getProtocol()))return;c=(HttpURLConnection)target.openConnection();c.setConnectTimeout(12000);c.setReadTimeout(15000);
   byte[] bytes;try(InputStream in=c.getInputStream();ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] chunk=new byte[8192];int n;while((n=in.read(chunk))!=-1){if(out.size()+n>12*1024*1024)throw new IOException("Image too large");out.write(chunk,0,n);}bytes=out.toByteArray();}
   BitmapFactory.Options bounds=new BitmapFactory.Options();bounds.inJustDecodeBounds=true;BitmapFactory.decodeByteArray(bytes,0,bytes.length,bounds);int sample=1;while(bounds.outWidth/sample>1600||bounds.outHeight/sample>2000)sample*=2;BitmapFactory.Options options=new BitmapFactory.Options();options.inSampleSize=sample;Bitmap bitmap=BitmapFactory.decodeByteArray(bytes,0,bytes.length,options);if(bitmap!=null){images.put(url,bitmap);runOnUiThread(()->{if(url.equals(view.getTag()))view.setImageBitmap(bitmap);});}
  }catch(Exception ignored){}finally{if(c!=null)c.disconnect();}});return view;
 }
 void whatsapp(String text){openUrl("https://wa.me/919004517938?text="+Uri.encode(text));}
 void openUrl(String url){try{Uri u=Uri.parse(url);if(!"https".equals(u.getScheme()))return;startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){toast("Please install a browser or WhatsApp to continue.");}}
 void hideKeyboard(){View focus=getCurrentFocus();if(focus!=null)((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).hideSoftInputFromWindow(focus.getWindowToken(),0);}
 void handleIntent(Intent intent){if(intent!=null)auth.handle(intent.getData(),this::authResult);}
 @Override protected void onNewIntent(Intent intent){super.onNewIntent(intent);setIntent(intent);handleIntent(intent);}
 void goBack(){if(busy){toast("Please wait…");return;}if(screen.equals("Checkout"))nav("Bag");else if(screen.equals("Custom")&&product!=null)nav("Product");else nav("Home");}
 @Override public void onBackPressed(){if(screen.equals("Home"))super.onBackPressed();else goBack();}
 @Override protected void onDestroy(){workers.shutdown();auth.close();super.onDestroy();}
 static final class NavIcon extends View {
  final int type,color;NavIcon(Context context,int t,int c){super(context);type=t;color=c;setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);}
  protected void onDraw(Canvas canvas){super.onDraw(canvas);canvas.save();canvas.scale(getWidth()/24f,getHeight()/24f);Paint p=new Paint(Paint.ANTI_ALIAS_FLAG);p.setColor(color);p.setStrokeWidth(1.6f);p.setStyle(Paint.Style.STROKE);p.setStrokeJoin(Paint.Join.ROUND);
   Path path=new Path();switch(type){
    case 0:path.moveTo(3,10);path.lineTo(12,3);path.lineTo(21,10);path.moveTo(5,9);path.lineTo(5,21);path.lineTo(10,21);path.lineTo(10,15);path.lineTo(14,15);path.lineTo(14,21);path.lineTo(19,21);path.lineTo(19,9);canvas.drawPath(path,p);break;
    case 1:for(int x:new int[]{3,14})for(int y:new int[]{3,14})canvas.drawRoundRect(x,y,x+7,y+7,1,1,p);break;
    case 2:path.moveTo(12,21);path.cubicTo(2,14,0,8,5,4);path.cubicTo(8,2,11,4,12,6);path.cubicTo(14,2,19,2,21,6);path.cubicTo(25,12,17,18,12,21);canvas.drawPath(path,p);break;
    case 3:canvas.drawRoundRect(4,7,20,22,2,2,p);canvas.drawArc(8,1,16,13,180,180,false,p);break;
    default:canvas.drawCircle(12,7,4,p);canvas.drawArc(4,13,20,29,180,180,false,p);
   }canvas.restore();
  }
 }
}
