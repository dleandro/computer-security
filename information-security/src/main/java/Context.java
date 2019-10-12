import java.security.cert.X509Certificate;

public class Context {

  private X509Certificate certificate;


    public Context(){

    }

    public X509Certificate getCertificate() {
        return certificate;
    }

    public void setcertificate(X509Certificate cer) {
        this.certificate = cer;
    }
}
