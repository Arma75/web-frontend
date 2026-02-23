const POSTGRESQL_TYPE_TO_JAVA_MAP = {
    'SMALLINT': { javaType: 'Integer', import: null },
    'INTEGER': { javaType: 'Integer', import: null },
    'INT': { javaType: 'Integer', import: null },
    'BIGINT': { javaType: 'Long', import: null },
    'DECIMAL': { javaType: 'BigDecimal', import: 'java.math.BigDecimal' },
    'NUMERIC': { javaType: 'BigDecimal', import: 'java.math.BigDecimal' },
    'REAL': { javaType: 'Float', import: null },
    'DOUBLE PRECISION': { javaType: 'Double', import: null },
    'CHARACTER VARYING': { javaType: 'String', import: null },
    'VARCHAR': { javaType: 'String', import: null },
    'CHARACTER': { javaType: 'String', import: null },
    'CHAR': { javaType: 'String', import: null },
    'TEXT': { javaType: 'String', import: null },
    'TIME': { javaType: 'LocalTime', import: 'java.time.LocalTime' },
    'DATE': { javaType: 'LocalDate', import: 'java.time.LocalDate' },
    'TIMESTAMP': { javaType: 'LocalDateTime', import: ['java.time.LocalDateTime', 'org.springframework.format.annotation.DateTimeFormat'] },
    'TIMESTAMP WITH TIME ZONE': { javaType: 'OffsetDateTime', import: 'java.time.OffsetDateTime' },
    'TIMESTAMPTZ': { javaType: 'OffsetDateTime', import: 'java.time.OffsetDateTime' },
    'BOOLEAN': { javaType: 'Boolean', import: null },
    'UUID': { javaType: 'UUID', import: 'java.util.UUID' },
    'JSON': { javaType: 'String', import: null },
    'JSONB': { javaType: 'String', import: null },

    'CREATE DATETIME': { javaType: 'LocalDateTime', import: ['java.time.LocalDateTime', 'org.springframework.format.annotation.DateTimeFormat'] },
    'UPDATE DATETIME': { javaType: 'LocalDateTime', import: ['java.time.LocalDateTime', 'org.springframework.format.annotation.DateTimeFormat'] },
    'LOGICAL USE': { javaType: 'String', import: null },
    'LOGICAL DELETE': { javaType: 'String', import: null }
};

const DEFAULT_COLUMN_OPTIONS = {
    name: "COLUMN_ID",
    comment: "COLUMN ID(PK)",
    type: "INT",
    length: "100",
    pk: true,
    notNull: true,
    autoIncrease: true,
    defaultValue: null
};

const DEFAULT_TABLE_OPTIONS = {
    name: "COLUMN_ID",
    comment: "COLUMN ID(PK)",
    columns: []
};

const DEFAULT_SPRINGBOOT_PROJECT_OPTIONS = {
    teamName: "team",
    projectName: "demoProject",
    javaVersion: 17,
    table: null
};

class Column {
    constructor(userOptions = {}) {
        Object.assign(this, DEFAULT_COLUMN_OPTIONS, userOptions);
    }
}

class Table {
    constructor(userOptions = {}) {
        Object.assign(this, DEFAULT_TABLE_OPTIONS, userOptions);
    }
}

class SpringBootProject {
    constructor(userOptions = {}) {
        Object.assign(this, DEFAULT_SPRINGBOOT_PROJECT_OPTIONS, userOptions);
    }
}

const JavaConverter = {
    toJavaType(column) {
        if (column.autoIncrease) {
            return 'Long';
        }
        
        const type = column.type.toUpperCase();
        if (POSTGRESQL_TYPE_TO_JAVA_MAP[type]) {
            return POSTGRESQL_TYPE_TO_JAVA_MAP[type].javaType;
        }

        return 'Object';
    },
    toJavaTypeImport(column) {
        const type = column.type.toUpperCase();

        if (POSTGRESQL_TYPE_TO_JAVA_MAP[type]) {
            return POSTGRESQL_TYPE_TO_JAVA_MAP[type].import;
        }

        return null;
    },
    toParameter(column) {
        return `${this.toJavaType(column)} ${this.toFieldName(column)}`;
    },

    toFieldName(column) {
        return toCamelCase(column.name);
    },
    toFieldDeclaration(column, options = {}) {
        const {
            access = "private",
            indent = 4,
            useComment = false,
            useSwagger = false
        } = options;

        const javaType = this.toJavaType(column);
        const memberName = this.toFieldName(column);
        const space = " ".repeat(indent);

        let javaCode = "";
        
        if (useComment) {
            javaCode += `${space}/**\n`;
            javaCode += `${space} * ${(column.comment || column.name)}\n`;
            javaCode += `${space} */\n`;
        }

        if (useSwagger) {
            javaCode += `${space}@Schema(description = "${column.comment || column.name}")\n`;
        }

        if (javaType == 'LocalTime') {
            javaCode += `${space}@DateTimeFormat(pattern = "HH:mm:ss")\n`;
        } else if (javaType == 'LocalDate') {
            javaCode += `${space}@DateTimeFormat(pattern = "yyyy-MM-dd")\n`;
        } else if (javaType == 'LocalDateTime') {
            javaCode += `${space}@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")\n`;
        }

        javaCode += `${space}${access} ${javaType} ${memberName};`;
        return javaCode;
    },

    toSetterMethod(column, options) {
        const {
            access = "public",
            indent = 4,
            useComment = false
        } = options;

        const fieldName = this.toFieldName(column);
        const parameterDeclaration = this.toParameter(column);
        const space = " ".repeat(indent);

        let javaCode = "";
        
        if (useComment) {
            javaCode += `${space}/**\n`;
            javaCode += `${space} * ${column.comment || column.name} 값을 설정합니다.\n`;
            javaCode += `${space} * \n`;
            javaCode += `${space} * @param ${fieldName} ${column.comment || column.name}\n`;
            javaCode += `${space} */\n`;
        }

        javaCode += `${space}${access} void set${toPascalCase(column.name)}(${parameterDeclaration}) {\n`;
        javaCode += `${space}    this.${fieldName} = ${fieldName};\n`;
        javaCode += `${space}}`;

        return javaCode;
    },
    toSetterInvocation(column, parameter = "", indent = 0) {
        return `${" ".repeat(indent)}set${toPascalCase(column.name)}(${parameter})`;
    },

    toGetterMethod(column, options) {
        const {
            access = "public",
            indent = 4,
            useComment = false
        } = options;

        const javaType = this.toJavaType(column);
        const memberName = this.toFieldName(column);
        const space = " ".repeat(indent);

        let javaCode = "";
        
        if (useComment) {
            javaCode += `${space}/**\n`;
            javaCode += `${space} * ${column.comment || column.name} 값을 반환합니다.\n`;
            javaCode += `${space} * \n`;
            javaCode += `${space} * @return ${column.comment || column.name}\n`;
            javaCode += `${space} */\n`;
        }

        javaCode += `${space}${access} ${javaType} get${toPascalCase(column.name)}() {\n`;
        javaCode += `${space}    return ${memberName};\n`;
        javaCode += `${space}}`;

        return javaCode;
    },
    toGetterInvocation(column, indent = 0) {
        return `${" ".repeat(indent)}get${toPascalCase(column.name)}()`;
    },

    toValidationLogic(column, indent = 0) {
        if (column.autoIncrease) {
            return null;
        }

        const fieldName = this.toFieldName(column);
        const space = " ".repeat(indent);
        const javaCode = [];

        if (column.notNull) {
            let condition = `${fieldName} == null`;
            if (this.toJavaType(column) === 'String') {
                condition += ` || ${fieldName}.isBlank()`;
            }

            javaCode.push(`${space}if (!isPatch && (${condition})) {`);
            javaCode.push(`${space}    throw new IllegalArgumentException("${fieldName} is required.");`);
            javaCode.push(`${space}}`);
        }

        if (column.length && this.toJavaType(column) === 'String') {
            javaCode.push(`${space}if (${fieldName} != null && ${fieldName}.length() > ${column.length}) {`);
            javaCode.push(`${space}    throw new IllegalArgumentException("${fieldName} length cannot exceed ${column.length}.");`);
            javaCode.push(`${space}}`);
        }

        return javaCode.join('\n');
    },
    toValidationComment(indent = 0) {
        const space = " ".repeat(indent);
        
        let javaCode = "";
        javaCode += `${space}/**\n`;
        javaCode += `${space} * DTO의 유효성을 검증합니다.\n`;
        javaCode += `${space} * \n`;
        javaCode += `${space} * @param isPatch 패치(Partial Update) 여부. \n`;
        javaCode += `${space} * true일 경우 필수 값 체크를 건너뛰고 입력된 값의 길이만 검증합니다.\n`;
        javaCode += `${space} * \n`;
        javaCode += `${space} * @throws IllegalArgumentException 유효성 검증 실패 시 발생\n`;
        javaCode += `${space} */`;
        
        return javaCode;
    },

    toToStringMethod(table, options) {
        const {
            postfix = "DTO",
            indent = 4,
            useComment = false
        } = options;

        const space = " ".repeat(indent);
        const className = toPascalCase(table.name) + postfix;
        const toStringFields = table.columns.map(c => `${space}           "${this.toFieldName(c)}=" + ${this.toFieldName(c)}`).join(' + ", " + \n');

        let javaCode = "";
        
        if (useComment) {
            javaCode += `${space}/**\n`;
            javaCode += `${space} * 객체의 상태를 문자열로 반환합니다.\n`;
            javaCode += `${space} * 주요 필드 값을 포함하여 디버깅 및 로깅 시에 활용됩니다.\n`;
            javaCode += `${space} * \n`;
            javaCode += `${space} * @return 객체 상태 문자열\n`;
            javaCode += `${space} */\n`;
        }

        javaCode += `${space}@Override\n`;
        javaCode += `${space}public String toString() {\n`;
        javaCode += `${space}    return "${className}{" +\n`;
        javaCode += `${toStringFields}${toStringFields.length > 0? ' +\n' : ''}`;
        javaCode += `${space}           "}";\n`;
        javaCode += `${space}}`;

        return javaCode;
    },

    toDTO(project) {
        const {teamName, projectName, writeComment, useLombok, dtoPostfix, useDateRange, useSwagger} = project;

        const table = project.table;
        const className = toPascalCase(table.name) + dtoPostfix;

        const importSet = new Set();
        table.columns.map(c => this.toJavaTypeImport(c)).filter(s => s).map(arr => [].concat(arr).forEach(s => importSet.add(`import ${s};`)));
        if (useLombok) {
            importSet.add('import lombok.Getter;');
            importSet.add('import lombok.Setter;');
            importSet.add('import lombok.ToString;');
            importSet.add('import lombok.NoArgsConstructor;');
            importSet.add('import lombok.AllArgsConstructor;');
            importSet.add('import lombok.Builder;');
        }
        if (useSwagger) {
            importSet.add('import io.swagger.v3.oas.annotations.media.Schema;');
        }

        let targetColumns = [];
        table.columns.map(c => {
            targetColumns.push(c);
            if (useDateRange && ['LocalTime', 'LocalDate', 'LocalDateTime', 'OffsetDateTime'].includes(this.toJavaType(c))) {
                let startDateColumn = {...c};
                startDateColumn.name += 'Start';
                startDateColumn.comment = (c.comment || c.name) + ' 시작일';
                startDateColumn.autoIncrease = false;
                targetColumns.push(startDateColumn);

                let endDateColumn = {...c};
                endDateColumn.name += 'End';
                endDateColumn.comment = (c.comment || c.name) + ' 종료일';
                endDateColumn.autoIncrease = false;
                targetColumns.push(endDateColumn);
            }
        });

        const fields = targetColumns.map(c => `${this.toFieldDeclaration(c, {useComment: writeComment, useSwagger: useSwagger})}`).filter(s => s).join('\n\n');
        const getters = targetColumns.map(c => `${this.toGetterMethod(c, {useComment: writeComment})}`).filter(s => s).join('\n\n');
        const setters = targetColumns.map(c => `${this.toSetterMethod(c, {useComment: writeComment})}`).filter(s => s).join('\n\n');

        const validates = targetColumns.map(col => this.toValidationLogic(col, 8)).filter(s => s).join('\n\n');
        let validationMethod = "";
        if (validates.length > 0) {
            if (writeComment) {
                let comment = this.toValidationComment(4);
                validationMethod += `${comment == null? '' : (comment + '\n')}`;
            }
            validationMethod += `    public void validate(boolean isPatch) {\n`;
            validationMethod += `${validates}\n`;
            validationMethod += `    }`;
        }

        let toStringMethod = this.toToStringMethod(table, {postfix : dtoPostfix, useComment : writeComment});

        let javaCode = "";
        javaCode += `package com.${teamName}.${projectName}.${table.name}.dto;\n\n`;
        javaCode += `${[...importSet].sort().join('\n')}${importSet.size > 0? '\n\n' : ''}`;
        if (writeComment) {
            let comment = this.toDTOComment(project);
            javaCode += `${comment == null? '' : (comment + '\n')}`;
        }
        if (useLombok) {
            javaCode += `@Getter\n`;
            javaCode += `@Setter\n`;
            javaCode += `@ToString\n`;
            javaCode += `@NoArgsConstructor\n`;
            javaCode += `@AllArgsConstructor\n`;
            javaCode += `@Builder\n`;
        }
        javaCode += `public class ${className} {\n`;
        javaCode += `${fields}${fields.length > 0? '\n\n' : ''}`;
        if (!useLombok) {
            javaCode += `${getters}${getters.length > 0? '\n\n' : ''}`;
            javaCode += `${setters}${setters.length > 0? '\n\n' : ''}`;
            javaCode += `${toStringMethod}\n`;
        }
        javaCode += `${validationMethod}${validationMethod.length > 0? '\n\n' : ''}`;
        javaCode += `}`;
        
        return javaCode;
    },
    toDTOComment(project, indent = 0) {
        const space = " ".repeat(indent);
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        let javaCode = "";
        javaCode += `${space}/**\n`;
        javaCode += `${space} * ${project.table.comment || project.table.name} DTO\n`;
        javaCode += `${space} * \n`;
        javaCode += `${space} * @author ${project.author || 'system'}\n`;
        javaCode += `${space} * @since ${date}\n`;
        javaCode += `${space} */`;
        
        return javaCode;
    }
}