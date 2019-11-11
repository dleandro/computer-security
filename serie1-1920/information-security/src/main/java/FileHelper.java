import javax.crypto.Cipher;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.cert.Certificate;
import java.util.Map;

public class FileHelper {
     String password;
    Certificate certificate;
        File metadata;
        File privateKey;
        Cipher cipher;
        File cipheredText;
        String out;


    public FileHelper(){

    }

    public Certificate getCertificate() {
        return certificate;
    }

    public Object getIv(){
        Path path=metadata.toPath();
        try {
            return Files.readAttributes(path,"user:IV").get("IV");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Object getEncryptedKey(){
        Path path=metadata.toPath();
        try {
            return Files.readAttributes(path,"user:Key").get("Key");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Cipher getCipher() {
        return cipher;
    }
}
