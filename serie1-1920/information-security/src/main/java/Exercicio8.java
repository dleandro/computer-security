import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.xml.crypto.Data;
import java.io.*;
import java.security.NoSuchAlgorithmException;

public class Exercicio8 {

    public static void main(String[] args) throws NoSuchPaddingException {
        try {
            //Create Message and Key
            KeyGenerator generator=KeyGenerator.getInstance("AES");
            SecretKey key=generator.generateKey();
            String mensagem="Teste do Mac";

            //Create Cipher
            Cipher cipher=Cipher.getInstance("AES");

            //finalmessage=message + mac
            byte[] mac=generateMac(key,mensagem);
            byte[] finalMessage=concatenate(mensagem.getBytes(),mac);


            //encrypt finalmessage to send over
            byte[] encrypted=encryptmessage(finalMessage,key,cipher);
            System.out.println(new String(encrypted));

            //decrypt the recieved message
            byte[] decrypted=decryptmessage(encrypted,key,cipher);
            System.out.println(new String(decrypted));

            //verify the mac's
            System.out.println(verifyMac(key,decrypted));

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    private static byte[] concatenate(byte[] message, byte[] mac) {
        ByteArrayOutputStream byteArrayOutputStream=new ByteArrayOutputStream();
        DataOutputStream dataOutputStream=new DataOutputStream(byteArrayOutputStream);
        try {
            dataOutputStream.writeInt(message.length);
            dataOutputStream.write(message);
            dataOutputStream.write(mac);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return byteArrayOutputStream.toByteArray();
    }

    private static byte[] decryptmessage(byte[] toDecrypt,SecretKey key,Cipher cipher) {
        try {
            cipher.init(Cipher.DECRYPT_MODE, key);
           return cipher.doFinal(toDecrypt);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static byte[] encryptmessage(byte[] toEncrypt, SecretKey key,Cipher cipher) {
        try {
            cipher.init(Cipher.ENCRYPT_MODE,key);
            return cipher.doFinal(toEncrypt);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    private static byte[] generateMac(SecretKey key, String message){
        byte[] mensagem=message.getBytes();
        try {
           Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(key);
            return mac.doFinal(mensagem);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static boolean verifyMac(SecretKey key, byte[] message){
        try {
            Mac mac=Mac.getInstance("HmacSHA256");
            mac.init(key);
            DataInputStream inputStream=new DataInputStream(new ByteArrayInputStream(message));
            int length=inputStream.readInt();
            byte[]mensagem=inputStream.readNBytes(length);
            byte[] oldMac=inputStream.readAllBytes();
            byte[] newMac=mac.doFinal(mensagem);
            return new String(oldMac).equals(new String(newMac));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
