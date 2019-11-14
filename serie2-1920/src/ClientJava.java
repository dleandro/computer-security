import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
import java.security.Key;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;

public class ClientJava {

    public static void main(String[] args) throws Exception {
        try {
            TrustManagerFactory trustManagerFactory=createTrustManagerFactory();
            SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();

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

    private static TrustManagerFactory createTrustManagerFactory(KeyStore ks) {
        try {
            TrustManagerFactory factory=TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            factory.init(ks);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
