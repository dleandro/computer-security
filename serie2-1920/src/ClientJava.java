import javax.net.ssl.*;
import java.io.FileInputStream;
import java.net.ServerSocket;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

public class ClientJava {

    private static String certificatePath="C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\computer-security\\serie1-1920\\cert-CA\\CA1.cer";
    private static String intPath="C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\computer-security\\serie1-1920\\cert-CAintermedia\\CA1-int.cer";
    private static String keyPath="C:\\Users\\joaob\\Desktop\\ISEL\\QUINTO SEMESTRE\\SI\\computer-security\\serie2-1920\\serie2-e-anexos\\Alice_1.pfx";
    private static String url="https://www.secure-server.edu:4433/";
    private static  String password="changeit";

    public static void main(String[] args) throws Exception {
        try {
            Certificate certificate=createCertificate(certificatePath);
            KeyStore keyStore=createKeyStore();
            Certificate certificateint=createCertificate(intPath);
            addCertificate(keyStore,"certificate",certificate);
            addCertificate(keyStore,"certificate",certificateint);
            TrustManagerFactory trustManagerFactory=createTrustManagerFactory(keyStore);
            TrustManager trustManagers[] = trustManagerFactory.getTrustManagers();

            KeyStore keyStore2=createKeyStore();
            associateKey(keyStore2,keyPath,password);
            KeyManagerFactory keyManagerFactory=KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            keyManagerFactory.init(keyStore2,password.toCharArray());
            KeyManager[] keyManager=keyManagerFactory.getKeyManagers();

            SSLContext sslContext=SSLContext.getInstance("TLS");
            sslContext.init(keyManager,trustManagers,new SecureRandom());



            SSLSocketFactory factory = sslContext.getSocketFactory();

             // socket SSL de cliente
            SSLSocket socket = (SSLSocket) factory.createSocket("www.secure-server.edu", 4433);


            // Mostrar certificado do servidor
            System.out.println(socket.getSession().getPeerCertificates()[0]);

            // mostrar esquemas criptográficos acordados
            System.out.println(socket.getSession().getCipherSuite());

        }catch (Exception e) {
            e.printStackTrace();
            }
    }

    private static void associateKey(KeyStore keystore,String Keypath,String password) {
        try {
            FileInputStream fis=new FileInputStream(Keypath);
            keystore.load(fis,password.toCharArray());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void addCertificate(KeyStore keyStore, String certificate, Certificate certificate1) {
        try {
            keyStore.setCertificateEntry(certificate,certificate1);
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }
    }

    private static Certificate createCertificate(String path) {
        try {
            FileInputStream fis=new FileInputStream(path);
            CertificateFactory factory=CertificateFactory.getInstance("X.509");
            return factory.generateCertificate(fis);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static KeyStore createKeyStore() {
        try {
            KeyStore keyStore=KeyStore.getInstance(KeyStore.getDefaultType());
            keyStore.load(null);
            return keyStore;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static TrustManagerFactory createTrustManagerFactory(KeyStore ks) {
        try {
            TrustManagerFactory factory=TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            factory.init(ks);
            return factory;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
