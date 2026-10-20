package in.co.ranisaboutique.app;
import android.app.*;
import android.os.*;
import android.content.*;
import android.view.accessibility.*;
import android.graphics.Bitmap;
import java.io.*;
public class SmokeInstrumentation extends Instrumentation {
 @Override public void onCreate(Bundle args){super.onCreate(args);start();}
 boolean has(AccessibilityNodeInfo node,String value){
  if(node==null)return false;
  if((node.getText()!=null&&node.getText().toString().contains(value))||(node.getContentDescription()!=null&&node.getContentDescription().toString().equals(value)))return true;
  for(int i=0;i<node.getChildCount();i++)if(has(node.getChild(i),value))return true;return false;
 }
 boolean click(AccessibilityNodeInfo node,String value){
  if(node==null)return false;
  if(node.getContentDescription()!=null&&node.getContentDescription().toString().equals(value))return node.performAction(AccessibilityNodeInfo.ACTION_CLICK);
  for(int i=0;i<node.getChildCount();i++)if(click(node.getChild(i),value))return true;return false;
 }
 @Override public void onStart(){
  Bundle result=new Bundle();
  try{
   Intent intent=getTargetContext().getPackageManager().getLaunchIntentForPackage("in.co.ranisaboutique.app");intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);getTargetContext().startActivity(intent);
   UiAutomation ui=getUiAutomation();Thread.sleep(12000);
   AccessibilityNodeInfo root=ui.getRootInActiveWindow();
   for(String tab:new String[]{"Home","Categories","Wishlist","Bag","Profile"})if(!has(root,tab+" tab"))throw new AssertionError("Missing bottom tab: "+tab);
   if(!click(root,"Bag tab"))throw new AssertionError("Bag navigation failed");Thread.sleep(1000);
   if(!has(ui.getRootInActiveWindow(),"Your shopping bag"))throw new AssertionError("Bag screen missing");
   click(ui.getRootInActiveWindow(),"Profile tab");Thread.sleep(1000);
   if(!has(ui.getRootInActiveWindow(),"Continue with Google"))throw new AssertionError("Google sign-in button missing");
   click(ui.getRootInActiveWindow(),"Home tab");Thread.sleep(1000);
   Bitmap image=ui.takeScreenshot();if(image!=null){File file=new File(getTargetContext().getExternalFilesDir(null),"ranisa-home.png");try(FileOutputStream out=new FileOutputStream(file)){image.compress(Bitmap.CompressFormat.PNG,100,out);}}
   result.putString("stream","Native navigation and Google sign-in surface checks passed.\n");finish(Activity.RESULT_OK,result);
  }catch(Throwable error){result.putString("stream","FAIL: "+error.getMessage());finish(Activity.RESULT_CANCELED,result);}
 }
}
