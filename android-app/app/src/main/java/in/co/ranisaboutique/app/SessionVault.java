package in.co.ranisaboutique.app;
import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import java.security.KeyStore;
import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
final class SessionVault {
 private final SharedPreferences prefs;
 private static final String ALIAS="ranisa_session_v1";
 SessionVault(Context c){prefs=c.getSharedPreferences("ranisa-private",Context.MODE_PRIVATE);}
 private javax.crypto.SecretKey key() throws Exception {
  KeyStore store=KeyStore.getInstance("AndroidKeyStore");store.load(null);
  if(!store.containsAlias(ALIAS)){KeyGenerator gen=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");gen.init(new KeyGenParameterSpec.Builder(ALIAS,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build());gen.generateKey();}
  return (javax.crypto.SecretKey)store.getKey(ALIAS,null);
 }
 void write(String name,String value)throws Exception{
  Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key());
  String blob=Base64.encodeToString(cipher.getIV(),Base64.NO_WRAP)+":"+Base64.encodeToString(cipher.doFinal(value.getBytes(java.nio.charset.StandardCharsets.UTF_8)),Base64.NO_WRAP);
  if(!prefs.edit().putString(name,blob).commit())throw new java.io.IOException("Could not save account securely.");
 }
 String read(String name)throws Exception{
  String blob=prefs.getString(name,"");if(blob.isEmpty())return "";
  String[] parts=blob.split(":");if(parts.length!=2)throw new java.io.IOException("Invalid saved session");
  Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.DECRYPT_MODE,key(),new GCMParameterSpec(128,Base64.decode(parts[0],Base64.NO_WRAP)));
  return new String(cipher.doFinal(Base64.decode(parts[1],Base64.NO_WRAP)),java.nio.charset.StandardCharsets.UTF_8);
 }
 void remove(String name){prefs.edit().remove(name).commit();}
}
