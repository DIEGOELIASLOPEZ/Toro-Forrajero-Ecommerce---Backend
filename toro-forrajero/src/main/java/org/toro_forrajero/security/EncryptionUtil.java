package org.toro_forrajero.security;

import org.springframework.stereotype.Component;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class EncryptionUtil {

    private static final String ALGORITHM = "AES";

    // Leemos la llave desde la variable de entorno llamada CARD_SECRET_KEY
    private static final String SECRET_KEY = getSecretKeyFromEnv();

    private static String getSecretKeyFromEnv() {
        String key = System.getenv("CARD_SECRET_KEY");
        if (key == null || key.isEmpty()) {
            // Valor por defecto
            key = "DefaultSecret16B";
        }
        return key;
    }

    public static String encrypt(String value) {
        if (value == null) return null;
        try {
            SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encryptedBytes = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error al encriptar el dato", e);
        }
    }

    public static String decrypt(String encryptedValue) {
        if (encryptedValue == null) return null;
        try {
            SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedValue);
            return new String(cipher.doFinal(decodedBytes), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error al descifrar el dato", e);
        }
    }
}