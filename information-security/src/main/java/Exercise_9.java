import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;


public class Exercise_9{


        private static byte[] mensagem;
        private static String file="C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\Encriptar.txt";
        public static void main(String[] args){
            try {
                X509Certificate cer = generateCertificate("C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\cert-end.entities\\Alice_1.cer");
                Context context = new Context();
                context.setcertificate(cer);
                execute(file, Operation.ENCRYPT, context);
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

    private static void execute(String filename,Operation operation,Context ctx){
            try {
                if (operation == Operation.ENCRYPT) {
                    encrypt(filename, operation, ctx);
                } else decrypt(filename, operation, ctx);
            }catch (Exception e){
                e.printStackTrace();
            }
        }

        private static void encrypt(String filename, Operation operation, Context ctx) {
            try {
                byte[] message = readfile(filename);
                IvParameterSpec iv = new IvParameterSpec(new byte[16]);
                System.out.println(new String(message));
                KeyGenerator generator = KeyGenerator.getInstance("AES");
                SecretKey key = generator.generateKey();
                Cipher cipher = Cipher.getInstance("AES");
                cipher.init(Cipher.ENCRYPT_MODE, key);
                byte[] encMessage = cipher.doFinal(message);
                System.out.println(new String(encMessage));
                writeFile("Encrypted.txt", encMessage);
                byte[] encryptedKey = encryptText(key.getEncoded(), ctx.getCertificate().getPublicKey(), iv);
                SecretKey finalKey = new SecretKeySpec(encryptedKey, "AES");
                createMetaDataFile(iv,finalKey);
            }catch (Exception e){
                e.printStackTrace();
            }

        }

    private static void createMetaDataFile(IvParameterSpec iv, SecretKey finalKey) {
            try {
               File file=new File("C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\Testes\\MetaData.txt");
               file.createNewFile();
                Path filepath=file.toPath();
           Files.setAttribute(filepath,"user:IV",iv.getIV());
               Files.setAttribute(filepath,"user:Key",finalKey.getEncoded());
            }catch (Exception e){
                e.printStackTrace();
            }
    }

    private static byte[] encryptText(byte[] encoded, PublicKey publicKey, IvParameterSpec iv)  {
            try {
                Cipher cipher = Cipher.getInstance("RSA");
                cipher.init(Cipher.ENCRYPT_MODE, publicKey);
                byte[] text = cipher.doFinal(encoded);
                return text;
            }catch (Exception e){
                e.printStackTrace();
            }
            return null;
    }

    private static void writeFile(String filename, byte[] encMessage) throws IOException {
            BufferedWriter bw=new BufferedWriter(new FileWriter(filename));
            bw.write(new String(encMessage));
            bw.close();
    }

    private static void decrypt(String filename, Operation operation, Context ctx) {

        }

        private static byte[] readfile(String path) throws IOException {
            BufferedReader bf=new BufferedReader(new FileReader(path));
            String message=bf.readLine();
            return message.getBytes();
        }
    }

