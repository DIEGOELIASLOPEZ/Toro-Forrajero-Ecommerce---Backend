package org.toro_forrajero.model.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

@Converter(autoApply = false)
public class YearMonthConverter implements AttributeConverter<YearMonth, String> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MM/yyyy");

    @Override
    public String convertToDatabaseColumn(YearMonth yearMonth) {
        return (yearMonth != null) ? yearMonth.format(FORMATTER) : null;
    }

    @Override
    public YearMonth convertToEntityAttribute(String dbData) {
        return (dbData != null && !dbData.isEmpty()) ? YearMonth.parse(dbData, FORMATTER) : null;
    }
}