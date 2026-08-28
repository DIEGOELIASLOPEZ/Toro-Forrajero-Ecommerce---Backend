package org.toro_forrajero.model.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.toro_forrajero.security.EncryptionUtil;

@Converter
public class CardEncryptionConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String attribute) {
        // Encripta antes de guardar en MySQL
        return EncryptionUtil.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        // Desencripta al leer de MySQL para usarlo en la app
        return EncryptionUtil.decrypt(dbData);
    }
}