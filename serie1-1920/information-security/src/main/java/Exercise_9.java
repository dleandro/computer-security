import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.X509EncodedKeySpec;


public class Exercise_9{


        private static byte[] mensagem;
        private static String encriptar="C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\encrypt.pdf";
    private static String decrypted="C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\Decrypted.pdf";
    private static String encrypted="C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\Encrypted.pdf";
        public static void main(String[] args){
            try {
                X509Certificate cer = generateCertificate("C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\cert-end.entities\\Alice_1.cer");
                FileHelper helper=new FileHelper();
                helper.certificate=cer;
                helper.metadata=new File("C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\MetaData.csv");
                helper.privateKey=new File("C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\pfx\\Alice_1.pfx");
                Cipher cipher=Cipher.getInstance("RSA");
                helper.cipher=cipher;
                helper.password="changeit";
                helper.out=encrypted;
                encrypt(encriptar,helper);
                helper.out=decrypted;
                decrypt(encrypted,helper);
            }catch (Exception e){
                e.printStackTrace();
            }
        }


    private static X509Certificate generateCertificate(String filename) throws FileNotFoundException, CertificateException {
        FileInputStream fis = new FileInputStream(filename);
        BufferedInputStream bis = new BufferedInputStream(fis);

        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        Certificate cer=cf.generateCertificate(bis);
        return (X509Certificate) cer;
    }

    private static void execute(String filename,Operation operation,FileHelper fileHelper){
            try {
                if (operation == Operation.ENCRYPT) {
                    encrypt(filename,fileHelper);
                } 
                else{ 
                    decrypt(filename,fileHelper);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }

    private static void decrypt(String filename, FileHelper fileHelper) {
            try {
                Cipher cipher=fileHelper.getCipher();
                IvParameterSpec Iv = new IvParameterSpec((byte[]) fileHelper.getIv());
                byte[] encryptedKey = (byte[]) fileHelper.getEncryptedKey();
                Key mykey=getKey(fileHelper.privateKey,fileHelper.password);
                cipher.init(Cipher.DECRYPT_MODE,mykey);
                byte[] finalKey=cipher.doFinal(encryptedKey);
                SecretKeySpec secretKeySpec = new SecretKeySpec(finalKey, "AES");
                cipher=Cipher.getInstance("AES/CBC/PKCS5Padding");
                cipher.init(Cipher.DECRYPT_MODE,secretKeySpec,Iv);
                byte[] text=readfile(filename);
                byte[] decryptedText=cipher.doFinal(text);
                writeFile(fileHelper.out,decryptedText);


            }catch (Exception e){
                e.printStackTrace();
            }
    }

    private static Key getKey(File privateKey, String password) {
            try {
                KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
                FileInputStream fis = new java.io.FileInputStream(privateKey);
                ks.load(fis, password.toCharArray());
                return ks.getKey("1", password.toCharArray());
            }catch(Exception e){
        e.printStackTrace();
        }
            return null;
    }

    private static void encrypt(String filename, FileHelper fileHelper) {
        try {
            SecretKey key=generateKey();
            Cipher cipher=Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE,fileHelper.getCertificate().getPublicKey());
            byte[] encKey=cipher.doFinal(key.getEncoded());
            cipher=Cipher.getInstance("AES/CBC/PKCS5Padding" );
            cipher.init(Cipher.ENCRYPT_MODE,key,new IvParameterSpec(new byte[16]));
            byte[] text=readfile(filename);
            byte[] encrypted=cipher.doFinal(text);
            writeFile(fileHelper.out,encrypted);
            createMetaDataFile(fileHelper.metadata.getPath(),new IvParameterSpec(cipher.getIV()),new SecretKeySpec(encKey,"AES"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static SecretKey generateKey() {
            try {
                KeyGenerator generator =KeyGenerator.getInstance("AES");
                return generator.generateKey();
            }catch (Exception e){
                e.printStackTrace();
            }
            return null;
    }

    private static Certificate createCertificate(String filename) {
        try {
            CertificateFactory certificateFactory=CertificateFactory.getInstance("X.509");
            return certificateFactory.generateCertificate(new FileInputStream(filename));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    private static void createMetaDataFile(String filename,IvParameterSpec iv, SecretKey finalKey) {
            try {
               File file=new File(filename);
               file.createNewFile();
                Path filepath=file.toPath();
           Files.setAttribute(filepath,"user:IV",iv.getIV());
               Files.setAttribute(filepath,"user:Key",finalKey.getEncoded());
            }catch (Exception e){
                e.printStackTrace();
            }
    }


    private static void writeFile(String filename, byte[] text) throws IOException {
                DataOutputStream dos=new DataOutputStream(new FileOutputStream(filename));
                dos.write(text);
                dos.close();
    }

        private static byte[] readfile(String path) throws IOException {
            DataInputStream dis=new DataInputStream(new FileInputStream(path));
            return dis.readAllBytes();
        }

    private static byte[] readfile(File file) throws IOException {
        BufferedReader bf=new BufferedReader(new FileReader(file.getPath()));
        String message=bf.readLine();
        return message.getBytes();
    }
    }

