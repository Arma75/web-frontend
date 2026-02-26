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
    name: "COLUMN_NAME",
    comment: "컬럼 설명",
    type: "VARCHAR",
    length: "100",
    pk: false,
    notNull: false,
    autoIncrease: false,
    defaultValue: ""
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
    },

    prepareData(project) {
        const table = project.table;
        const className = toPascalCase(table.name) + project.dtoPostfix;
        const importSet = new Set();
        
        // 1. 컬럼 확장 (Date Range 등)
        let targetColumns = [];
        table.columns.forEach(c => {
            const javaType = this.toJavaType(c);
            const fieldName = toCamelCase(c.name);
            
            // 기본 컬럼 추가
            targetColumns.push({
                ...c,
                javaType,
                fieldName,
                formatAnnotation: this.getDateTimeFormat(javaType)
            });

            // Date Range 옵션 시 시작/종료 컬럼 추가
            if (project.useDateRange && ['LocalTime', 'LocalDate', 'LocalDateTime', 'OffsetDateTime'].includes(javaType)) {
                ['Start', 'End'].forEach(suffix => {
                    targetColumns.push({
                        ...c,
                        name: c.name + suffix,
                        fieldName: fieldName + suffix,
                        comment: (c.comment || c.name) + (suffix === 'Start' ? ' 시작일' : ' 종료일'),
                        javaType,
                        formatAnnotation: this.getDateTimeFormat(javaType)
                    });
                });
            }

            // Import 수집
            const imp = this.toJavaTypeImport(c);
            if (imp) [].concat(imp).forEach(s => importSet.add(`import ${s};`));
        });

        // 2. Lombok & Swagger Import 추가
        if (project.useLombok) {
            ['Getter', 'Setter', 'ToString', 'NoArgsConstructor', 'AllArgsConstructor', 'Builder']
                .forEach(l => importSet.add(`import lombok.${l};`));
        }
        if (project.useSwagger) importSet.add('import io.swagger.v3.oas.annotations.media.Schema;');

        return {
            ...project,
            className,
            importList: [...importSet].sort(),
            targetColumns,
            currentDate: new Date().toISOString().split('T')[0],
            author: project.author || 'system',
            validationMethod: targetColumns.some(c => c.notNull || (c.length && c.javaType === 'String')),
            validationLogics: targetColumns.map(c => this.toValidationLogic(c, 8)).filter(s => s)
        };
    },

    getDateTimeFormat(javaType) {
        if (javaType === 'LocalTime') return '@DateTimeFormat(pattern = "HH:mm:ss")';
        if (javaType === 'LocalDate') return '@DateTimeFormat(pattern = "yyyy-MM-dd")';
        if (javaType === 'LocalDateTime') return '@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")';
        return null;
    },

    getTemplateData(project) {
        const table = project.table;
        const data = {};

        data.teamName = project.teamName;
        data.projectName = project.projectName;
        data.tableName = table.name;

        if (project.type === 'search request') {
            data.isSearchRequest = true;
        } else if (project.type === 'save request') {
            data.isSaveRequest = true;
        } else if (project.type === 'response') {
            data.isResponse = true;
        }

        const importSet = new Set();
        table.columns.map(c => this.toJavaTypeImport(c)).filter(s => s).map(arr => [].concat(arr).forEach(s => importSet.add(`${s}`)));
        if (project.useLombok) {
            importSet.add('lombok.Getter');
            importSet.add('lombok.Setter');
            importSet.add('lombok.ToString');
            importSet.add('lombok.NoArgsConstructor');
            importSet.add('lombok.AllArgsConstructor');
            importSet.add('lombok.Builder');
        }
        if (project.useSwagger) {
            importSet.add('io.swagger.v3.oas.annotations.media.Schema');
        }
        data.importList = [...importSet].sort();

        data.useLombok = project.useLombok;
        data.useSwagger = project.useSwagger;
        data.writeComment = project.writeComment;
        
        data.className = toPascalCase(table.name) + project.dtoPostfix;
        data.tableComment = (table.comment || table.name) + " DTO";
        data.today = new Date().toISOString().split('T')[0];

        let targetColumns = [];
        table.columns.map(c => {
            targetColumns.push(c);
            if (project.useDateRange && ['LocalTime', 'LocalDate', 'LocalDateTime', 'OffsetDateTime'].includes(this.toJavaType(c))) {
                let startDateColumn = {...c};
                startDateColumn.name += '_Start';
                startDateColumn.comment = (c.comment || c.name) + ' 시작일';
                startDateColumn.autoIncrease = false;
                targetColumns.push(startDateColumn);

                let endDateColumn = {...c};
                endDateColumn.name += '_End';
                endDateColumn.comment = (c.comment || c.name) + ' 종료일';
                endDateColumn.autoIncrease = false;
                targetColumns.push(endDateColumn);
            }
        });
        targetColumns.map(col => {
            col.javaType = this.toJavaType(col);
            col.fieldName = this.toFieldName(col);
            col.comment = col.comment || col.name;
            col.pascalName = toPascalCase(col.fieldName);
            col.isLocalTime = col.javaType === 'LocalTime';
            col.isLocalDate = col.javaType === 'LocalDate';
            col.isLocalDateTime = col.javaType === 'LocalDateTime';
            col.isString = col.javaType === 'String';
        });
        data.targetColumns = targetColumns;

        return data;
    },

    // 렌더링 실행
    toDTO(template, data) {
        const handlebar = Handlebars.compile(template);

        return handlebar(data);
    },
}

class ColumnRow {
    constructor(column = new Column()) {
        this.data = column;
        this.el = document.createElement('tr');
        this.render();
    }

    render() {
        this.el.innerHTML = `
            <td><input type="checkbox" name="check"/></td>
            <td><input type="text" name="name" data-field="name" value="${this.data.name}"/></td>
            <td><input type="text" name="comment" data-field="comment" value="${this.data.comment}"/></td>
            <td>
                <select name="type" data-field="type">
                    ${Object.keys(POSTGRESQL_TYPE_TO_JAVA_MAP).map(type => 
                        `<option value="${type}" ${this.data.type === type ? 'selected' : ''}>${type}</option>`
                    ).join('')}
                </select>
            </td>
            <td><input type="text" name="length" data-field="length" value="${this.data.length || ''}"/></td>
            <td><input type="checkbox" name="pk" data-field="pk" ${this.data.pk ? 'checked' : ''}/></td>
            <td><input type="checkbox" name="notNull" data-field="notNull" ${this.data.notNull ? 'checked' : ''}/></td>
            <td><input type="checkbox" name="autoIncrease" data-field="autoIncrease" ${this.data.autoIncrease ? 'checked' : ''}/></td>
            <td><input type="text" name="defaultValue" data-field="defaultValue" value="${this.data.defaultValue || ''}"/></td>
        `;

        this._initEvents();
        this._applyInteractions();
        this._applyFilters();
    }

    _initEvents() {
        this.el.querySelectorAll('[data-field]').forEach(input => {
            const eventType = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
            
            input.addEventListener(eventType, (e) => {
                const field = e.target.getAttribute('data-field');
                const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                
                this.data[field] = value;
                this._applyInteractions();
                this._updateDynamicFilter();
            });
        });
    }

    _applyInteractions() {
        const typeEl = this.el.querySelector('[name="type"]');
        const lengthEl = this.el.querySelector('[name="length"]');
        const pkEl = this.el.querySelector('[name="pk"]');
        const autoIncEl = this.el.querySelector('[name="autoIncrease"]');
        const notNullEl = this.el.querySelector('[name="notNull"]');
        const defaultValueEl = this.el.querySelector('[name="defaultValue"]');


        // auto increase인 경우
        if (autoIncEl.checked) {
            pkEl.checked = true;
            pkEl.disabled = true;

            typeEl.disabled = true;

            lengthEl.value = "";
            lengthEl.disabled = true;

            notNullEl.checked = true;
            notNullEl.disabled = true;

            defaultValueEl.value = "";
            defaultValueEl.disabled = true;

            this.data.pk = true;
        } else {
            pkEl.disabled = false;
            typeEl.disabled = false;
            lengthEl.disabled = false;
            notNullEl.disabled = false;
            defaultValueEl.disabled = false;
        }
        

        const lengthTypes = ['VARCHAR', 'CHARACTER', 'CHAR'];
        lengthEl.disabled = !lengthTypes.includes(typeEl.value);
    }

    _applyFilters() {
        new KokInputFilter(this.el.querySelector('[name="name"]'), { required: true, type: 'variable' });
        new KokInputFilter(this.el.querySelector('[name="length"]'), { type: 'int' });
        new KokInputFilter(this.el.querySelector('.number-type[name="defaultValue"]'), { type: 'int' });
    }
    
    _updateDynamicFilter() {
        const typeValue = this.el.querySelector('[name="type"]').value;
        const defaultInput = this.el.querySelector('[name="defaultValue"]');

        defaultInput.removeAttribute('data-status');

        if (!this.defaultFilter) {
            this.defaultFilter = new KokInputFilter(defaultInput);
        }

        const numericTypes = ['SMALLINT', 'INTEGER', 'INT', 'BIGINT', 'DECIMAL', 'NUMERIC', 'REAL', 'DOUBLE PRECISION'];
        if (numericTypes.includes(typeValue)) {
            this.defaultFilter.options.type = 'int';
        } else {
            this.defaultFilter.options.type = null;
        }
    }
}