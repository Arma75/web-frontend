const EXCEL_UTIL_TEMPLATE =
`package com.{{teamName}}.{{projectName}}.common.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletResponse;

public class ExcelUtil {
    private static boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }

        return true;
    }

    private static Object parseValue(Class<?> type, String value, Cell cell) {
        if (type == String.class) {
            return value;
        } else if (type == Short.class || type == short.class) {
            return (short) Double.parseDouble(value);
        } else if (type == Integer.class || type == int.class) {
            return (int) Double.parseDouble(value);
        } else if (type == Long.class || type == long.class) {
            return (long) Double.parseDouble(value);
        } else if (type == Double.class || type == double.class) {
            return Double.parseDouble(value);
        } else if (type == Float.class || type == float.class) {
            return Float.parseFloat(value);
        } else if (type == BigDecimal.class) {
            return new BigDecimal(value);
        } else if (type == Boolean.class || type == boolean.class) {
            return !("false".equalsIgnoreCase(value) || "0".equals(value) || "N".equalsIgnoreCase(value));
        } else if (type == LocalDateTime.class) {
            if (DateUtil.isCellDateFormatted(cell)) {
                return cell.getLocalDateTimeCellValue();
            }
            return LocalDateTime.parse(value, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } else if (type == LocalDate.class) {
            if (DateUtil.isCellDateFormatted(cell)) {
                return cell.getLocalDateTimeCellValue().toLocalDate();
            }
            return LocalDate.parse(value, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }

        return null;
    }
    
    public static <T> List<T> convertToList(MultipartFile file, int headerLength, Class<T> clazz) {
        List<T> dataList = new ArrayList<>();
        DataFormatter dataFormatter = new DataFormatter();
        Field[] fields = clazz.getDeclaredFields();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            for (int i = headerLength; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || isRowEmpty(row)) {
                    continue;
                }

                T dto = clazz.getDeclaredConstructor().newInstance();
                
                int colIndex = 0;
                for (int j = 0; j < fields.length; j++) {
                    Field field = fields[j];
                    field.setAccessible(true);

                    String fieldName = field.getName();
                    String setterName = "set" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
                    Method setter = null;
                    try {
                        setter = dto.getClass().getMethod(setterName, field.getType());
                    } catch (NoSuchMethodException e) {
                        continue;
                    }

                    Cell cell = row.getCell(colIndex++);
                    if (cell == null) {
                        continue;
                    }

                    String cellValue = dataFormatter.formatCellValue(cell);
                    if (cellValue == null || cellValue.isBlank()) {
                        continue;
                    }

                    Class<?> type = field.getType();
                    setter.invoke(dto, parseValue(type, cellValue, cell));
                }

                dataList.add(dto);
            }
        } catch (Exception e) {
            throw new RuntimeException("Excel parsing error: " + e.getMessage());
        }
        return dataList;
    }

    public static <T> void download(List<T> dtos, String fileNamePrefix, String[] headers, HttpServletResponse response) {
        if (dtos == null || dtos.isEmpty()) {
            return;
        }

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Sheet1");
            Field[] fields = dtos.get(0).getClass().getDeclaredFields();
            List<Field> targetFields = new ArrayList<>();

            for (Field field : fields) {
                String fieldName = field.getName();
                String getterName = "get" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);

                try {
                    dtos.get(0).getClass().getMethod(getterName);
                    targetFields.add(field);
                } catch (NoSuchMethodException e) {
                    continue;
                }
            }

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowIdx = 1;

            for (T dto : dtos) {
                Row row = sheet.createRow(rowIdx++);
                for (int j = 0; j < targetFields.size(); j++) {
                    Field field = targetFields.get(j);
                    String fieldName = field.getName();
                    String getterName = "get" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
                    Method getter = null;
                    try {
                        getter = dtos.get(0).getClass().getMethod(getterName);
                    } catch (NoSuchMethodException e) {
                        continue;
                    }

                    Object value = getter.invoke(dto);

                    if (value == null) {
                        row.createCell(j).setCellValue("");
                    } else {
                        row.createCell(j).setCellValue(value.toString());
                    }
                }
            }

            String fileName = fileNamePrefix + "_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

            workbook.write(response.getOutputStream());
        } catch (Exception e) {
            throw new RuntimeException("Excel download error: " + e.getMessage());
        }
    }
}
`;