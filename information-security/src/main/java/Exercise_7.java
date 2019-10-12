import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.security.*;

public class Exercise_7 {

    private static final String path="C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\Encriptar.txt";
    private static byte[] mensagem;
    public static void main(String[] args) throws NoSuchAlgorithmException, IOException, NoSuchPaddingException,
            InvalidKeyException, BadPaddingException, IllegalBlockSizeException, InvalidAlgorithmParameterException {
        KeyGenerator generator=KeyGenerator.getInstance("AES");
        SecretKey key=generator.generateKey();
        mensagem=readfile(path);


        Cipher cipher=Cipher.getInstance("AES");

        byte[] encriptedWithECB=encryptmessage(cipher,"AES/ECB/PKCS5Padding",mensagem,key,0);
        System.out.println(new String(encriptedWithECB));
        byte[] encriptedWithCBC=encryptmessage(cipher,"AES/CBC/PKCS5Padding",mensagem,key,16);
        System.out.println(new String(encriptedWithCBC));
        byte[] encriptedWithCFB=encryptmessage(cipher,"AES/CFB/PKCS5Padding",mensagem,key,16);
        System.out.println(new String(encriptedWithCFB));

        byte[] encriptedWithOFB=encryptmessage(cipher,"AES/OFB/PKCS5Padding",mensagem,key,16);
        System.out.println(new String(encriptedWithOFB));
        System.out.println(new String(decryptmessage(cipher,"AES/ECB/PKCS5Padding",encriptedWithECB,key,0)));
        System.out.println(new String(decryptmessage(cipher,"AES/CBC/PKCS5Padding",encriptedWithCBC,key,16)));
        System.out.println(new String(decryptmessage(cipher,"AES/CFB/PKCS5Padding",encriptedWithCFB,key,16)));
        System.out.println(new String(decryptmessage(cipher,"AES/OFB/PKCS5Padding",encriptedWithOFB,key,16)));






    }

    private static byte[] decryptmessage(Cipher cipher, String mode, byte[] message,SecretKey key,int paramslength)
            throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException,
            IllegalBlockSizeException, InvalidAlgorithmParameterException {
        cipher=Cipher.getInstance(mode);
        if (paramslength!=0) {
            cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(new byte[paramslength]));
        }
        else{
            cipher.init(Cipher.DECRYPT_MODE,key);
        }
        byte[] decrypted= cipher.doFinal(message);
        return decrypted;
    }

    private static byte[] encryptmessage(Cipher cipher,String mode,byte[] message,SecretKey key,int paramslength)
            throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException,
            InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        cipher=Cipher.getInstance(mode);

        if (paramslength!=0) {
            cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(new byte[paramslength]));
        }
        else{
            cipher.init(Cipher.ENCRYPT_MODE,key);
        }
        byte[] textEncrypted=cipher.doFinal(message);
        return textEncrypted;
    }

    private static byte[] readfile(String path) throws IOException {
        BufferedReader bf=new BufferedReader(new FileReader(path));
        String message=bf.readLine();
        System.out.println(message);
        return message.getBytes();
    }
}
