class Column {
    static TYPES = Object.freeze({
        CHAR: { dbType: 'CHAR', hasLength: true, hasPrecision: false },
        VARCHAR: { dbType: 'VARCHAR', hasLength: true, hasPrecision: false },
        TEXT: { dbType: 'TEXT', hasLength: false, hasPrecision: false },
        INTEGER: { dbType: 'INTEGER', hasLength: false, hasPrecision: false },
        NUMERIC: { dbType: 'NUMERIC', hasLength: false, hasPrecision: true },
        DATE: { dbType: 'DATE', hasLength: false, hasPrecision: false },
        TIME: { dbType: 'TIME', hasLength: false, hasPrecision: true },
        TIMESTAMP: { dbType: 'TIMESTAMP', hasLength: false, hasPrecision: true },
        BOOLEAN: { dbType: 'BOOLEAN', hasLength: false, hasPrecision: false },
        LOGICAL_USE: { dbType: 'CHAR', hasLength: true, defaultLength: 1, fixedLength: true, defaultAutoIncrement: false, fixedAutoIncrement: true, defaultName: 'USE_YN', defaultComment: '사용여부', defaultNullable: false, fixedNullable: true, defaultDefaultValue: 'Y' },
        CREATE_TIMESTAMP: { dbType: 'TIMESTAMP', hasLength: false, hasPrecision: false, defaultLength: null, fixedAutoIncrement: true, defaultName: 'REG_DTM', defaultComment: '등록일시', defaultPk: false, fixedPk: true, defaultNullable: false, fixedNullable: true, defaultDefaultValue: 'CURRENT_TIMESTAMP' },
        UPDATE_TIMESTAMP: { dbType: 'TIMESTAMP', hasLength: false, hasPrecision: false, defaultLength: null, fixedAutoIncrement: true, defaultName: 'UPD_DTM', defaultComment: '수정일시', defaultPk: false, fixedPk: true, defaultNullable: false, fixedNullable: true, defaultDefaultValue: 'CURRENT_TIMESTAMP' },
        // LOGICAL_DELETE: { hasLength: true, defaultLength: 1, fixedLength: true, defaultAutoIncrement: false, fixedAutoIncrement: true,defaultName: 'DEL_YN', defaultComment: '삭제여부', defaultNullable: false, fixedNullable: true, defaultDefaultValue: 'N' },
        
        // CHAR: { hasLength: true, hasPrecision: false },
        // VARCHAR: { hasLength: true, hasPrecision: false },
        // TEXT: { hasLength: false, hasPrecision: false },
        // INTEGER: { hasLength: false, hasPrecision: false },
        // NUMERIC: { hasLength: false, hasPrecision: true },
        // TIMESTAMP: { hasLength: false, hasPrecision: true },
        // BOOLEAN: { hasLength: false, hasPrecision: false },
        // 시스템 예약 타입 추가 (해피케이스용)
        // LOGICAL_DELETE: { isSystem: true, fixedName: 'DEL_YN', fixedType: 'BOOLEAN', fixedNullable: false, fixedDefault: 'false' },
        // LOGICAL_USE: { isSystem: true, fixedName: 'USE_YN', fixedType: 'BOOLEAN', fixedNullable: false, fixedDefault: 'true' },
        // CREATE_DATETIME: { isSystem: true, fixedName: 'REG_DT', fixedType: 'TIMESTAMP', fixedNullable: false, fixedDefault: 'CURRENT_TIMESTAMP' },
        // UPDATE_DATETIME: { isSystem: true, fixedName: 'UPD_DT', fixedType: 'TIMESTAMP', fixedNullable: false, fixedDefault: 'CURRENT_TIMESTAMP' }
    });

    static RESERVED_WORDS = Object.freeze(new Set([
        "ALL", "ANALYSE", "ANALYZE", "AND", "ANY", "ARRAY", "AS", "ASC", "ASYMMETRIC", "AUTHORIZATION",
        "BINARY", "BOTH", "CASE", "CAST", "CHECK", "COLLATE", "COLLATION", "COLUMN", "CONCURRENTLY",
        "CONSTRAINT", "CREATE", "CROSS", "CURRENT_CATALOG", "CURRENT_DATE", "CURRENT_ROLE",
        "CURRENT_SCHEMA", "CURRENT_TIME", "CURRENT_TIMESTAMP", "CURRENT_USER", "DEFAULT", "DEFERRABLE",
        "DESC", "DISTINCT", "DO", "ELSE", "END", "EXCEPT", "FALSE", "FETCH", "FOR", "FOREIGN", "FREEZE",
        "FROM", "FULL", "GRANT", "GROUP", "HAVING", "ILIKE", "IN", "INITIALLY", "INNER", "INTERSECT",
        "INTO", "IS", "ISNULL", "JOIN", "LATERAL", "LEADING", "LEFT", "LIKE", "LIMIT", "LOCALTIME",
        "LOCALTIMESTAMP", "NATURAL", "NOT", "NOTNULL", "NULL", "OFFSET", "ON", "ONLY", "OR", "ORDER",
        "OUTER", "OVERLAPS", "PLACING", "PRIMARY", "REFERENCES", "RETURNING", "RIGHT", "SELECT",
        "SESSION_USER", "SIMILAR", "SOME", "SYMMETRIC", "TABLE", "TABLESAMPLE", "THEN", "TO",
        "TRAILING", "TRUE", "UNION", "UNIQUE", "USER", "USING", "VARIADIC", "VERBOSE", "WHEN",
        "WHERE", "WINDOW", "WITH"
    ]));

    static TYPE_TO_JAVA_MAP = Object.freeze({
        'CHAR': { javaType: 'String', import: null },
        'VARCHAR': { javaType: 'String', import: null },
        'TEXT': { javaType: 'String', import: null },
        'INTEGER': { javaType: 'Integer', import: null },
        'NUMERIC': { javaType: 'BigDecimal', import: 'java.math.BigDecimal' },
        'DATE': { javaType: 'LocalDate', import: 'java.time.LocalDate' },
        'TIME': { javaType: 'LocalTime', import: 'java.time.LocalTime' },
        'TIMESTAMP': { javaType: 'LocalDateTime', import: ['java.time.LocalDateTime', 'org.springframework.format.annotation.DateTimeFormat'] },
        'BOOLEAN': { javaType: 'Boolean', import: null },
        'LOGICAL_USE': { javaType: 'String', import: null },
        'CREATE_TIMESTAMP': { javaType: 'LocalDateTime', import: ['java.time.LocalDateTime', 'org.springframework.format.annotation.DateTimeFormat'] },
        'UPDATE_TIMESTAMP': { javaType: 'LocalDateTime', import: ['java.time.LocalDateTime', 'org.springframework.format.annotation.DateTimeFormat'] },
        // 'LOGICAL_USE': { javaType: 'Boolean', import: null },
        // 'CREATE_DATETIME': { javaType: 'LocalDateTime', import: ['java.time.LocalDateTime'] },
        // 'UPDATE_DATETIME': { javaType: 'LocalDateTime', import: ['java.time.LocalDateTime'] },
    });

    static DEFAULT_VALUES = Object.freeze({
        name: '',
        comment: '',
        type: 'VARCHAR',
        length: 100,
        precision: 0,
        pk: false,
        unique: false,
        nullable: true,
        autoIncrement: false,
        defaultValue: '',
        isDefaultValueConstant: false, // true면 예약어, false면 일반 문자열
    });

    constructor(data = {}) {
        this.onChange = null;

        Object.assign(this, { ...Column.DEFAULT_VALUES, ...data });

        return new Proxy(this, {
            get: (target, prop) => {
                return target[prop];
            },
            set: (target, prop, value) => {
                const fixedPropName = `fixed${prop.charAt(0).toUpperCase() + prop.slice(1)}`;
                if (target[fixedPropName] === true) {
                    throw new Error(`'${prop}' 속성은 고정되어 있어 수정할 수 없습니다.`);
                }

                if (prop === 'name') {
                    if (Column.RESERVED_WORDS.has(value.toUpperCase())) {
                        throw new Error(`'${value}'은(는) PostgreSQL 예약어이므로 컬럼명으로 사용할 수 없습니다.`);
                    }
                }

                target[prop] = value;
                if (prop === 'type') {
                    const typeMeta = Column.TYPES[value.toUpperCase()];
                    if (typeMeta) {
                        if ((!this.name || typeMeta.fixedName) && typeMeta.defaultName !== undefined) {
                            this.name = typeMeta.defaultName;
                        }
                        if ((!this.comment || typeMeta.fixedComment) && typeMeta.defaultComment !== undefined) {
                            this.comment = typeMeta.defaultComment;
                        }
                        if ((!this.length || typeMeta.fixedLength) && typeMeta.defaultLength !== undefined) {
                            this.length = typeMeta.defaultLength;
                        }
                        if ((!this.pk || typeMeta.fixedPk) && typeMeta.defaultPk !== undefined) {
                            this.pk = typeMeta.defaultPk;
                        }
                        
                        if (typeMeta.defaultNullable !== undefined && typeMeta.defaultNullable !== null) {
                            this.nullable = typeMeta.defaultNullable;
                        }
                        if (typeMeta.defaultDefaultValue !== undefined && typeMeta.defaultDefaultValue !== null) {
                            this.defaultValue = typeMeta.defaultDefaultValue;
                        }

                        if (!typeMeta.hasLength) {
                            target.length = null;
                        }
                        if (!typeMeta.hasPrecision) {
                            target.precision = null;
                        }
                    }
                }

                if (prop === 'pk' && value) {
                    this.unique = true;
                    this.nullable = false;
                }
                if (prop === 'autoIncrement' && value) {
                    this.nullable = false;
                    this.defaultValue = '';
                }

                if (prop !== 'onChange' && typeof target[prop] !== 'function') {
                    if (target.onChange) {
                        target.onChange(prop, value);
                    }
                }

                return true;
            }
        });
    }

    toJSON() {
        const data = {};
        Object.keys(Column.DEFAULT_VALUES).forEach(key => {
            data[key] = this[key];
        });

        const typeKey = this.type.toUpperCase();
        const typeMeta = Column.TYPES[typeKey] || {};
        
        if (!typeMeta.hasLength) {
            delete data.length;
        }
        if (!typeMeta.hasPrecision) {
            delete data.precision;
        }

        return data;
    }

    getJavaType() {
        if (this.autoIncrement) {
            return 'Long';
        }
        
        const type = this.type.toUpperCase();
        if (Column.TYPE_TO_JAVA_MAP[type]) {
            return Column.TYPE_TO_JAVA_MAP[type].javaType;
        }

        return 'Object';
    }

    getJavaTypeImport() {
        if (this.autoIncrement) {
            return null;
        }

        const type = this.type.toUpperCase();
        if (Column.TYPE_TO_JAVA_MAP[type]) {
            return Column.TYPE_TO_JAVA_MAP[type].import;
        }
        return null;
    }

    get fixedLength() {
        const typeMeta = Column.TYPES[this.type.toUpperCase()];
        return !!typeMeta?.fixedLength;
    }
    get fixedAutoIncrement() {
        const typeMeta = Column.TYPES[this.type.toUpperCase()];
        return !!typeMeta?.fixedAutoIncrement;
    }
    get fixedUnique() {
        if (this.pk) {
            return true;
        }
        
        const typeMeta = Column.TYPES[this.type.toUpperCase()];
        return !!typeMeta?.fixedUnique;
    }
    get fixedNullable() {
        if (this.pk || this.autoIncrement) {
            return true;
        }
        
        const typeMeta = Column.TYPES[this.type.toUpperCase()];
        return !!typeMeta?.fixedNullable;
    }
    get fixedDefaultValue() {
        if (this.autoIncrement) {
            return true;
        }
        
        const typeMeta = Column.TYPES[this.type.toUpperCase()];
        return !!typeMeta?.fixedDefaultValue;
    }
}

class Schema {
    static DEFAULT_VALUES = Object.freeze({
        name: null,
        comment: null,
        columns: [],
    });

    constructor(data = {}) {
        this.onChange = null;

        Object.assign(this, { ...Schema.DEFAULT_VALUES, ...data });

        return new Proxy(this, {
            get: (target, prop) => {
                return target[prop];
            },
            set: (target, prop, value) => {
                console.log('set', target, prop, value);
                if (prop === 'name') {
                    if (Column.RESERVED_WORDS.has(value?.toUpperCase())) {
                        throw new Error(`'${value}'은(는) PostgreSQL 예약어이므로 테이블명으로 사용할 수 없습니다.`);
                    }
                }

                target[prop] = value;

                if (prop !== 'onChange' && typeof target[prop] !== 'function') {
                    if (target.onChange) {
                        target.onChange(prop, value);
                    }
                }

                return true;
            }
        });
    }

    toJSON() {
        return {
            name: this.name,
            comment: this.comment,
            columns: this.columns.map(col => col.toJSON())
        };
    }
    
    addColumn(columnData = {}) {
        const newColumn = new Column(columnData);
        
        newColumn.onChange = (prop, val) => {
            if (this.onChange) {
                this.onChange('columns', this.columns);
            }
        };

        this.columns.push(newColumn);
        if (this.onChange) {
            this.onChange('columns', this.columns);
        }

        return newColumn;
    }

    removeColumn(index) {
        this.columns.splice(index, 1);
        if (this.onChange) {
            this.onChange('columns', this.columns);
        }
    }
}

class ColumnComponent {
    constructor(column) {
        this.column = column;
        this.column.type = this.column.type || 'VARCHAR';
        this.column.onChange = (key, value) => {
            this.render();
        }

        this.element = this._createElement();
        this.render();
    }

    _createElement() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="small" name="name" placeholder="컬럼명"></td>
            <td><input type="text" class="small" name="comment" placeholder="설명"></td>
            <td>
                <select class="small" name="type">
                    ${Object.keys(Column.TYPES).map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
            </td>
            <td><input type="text" class="small" name="length" class="num-input"></td>
            <td><input type="checkbox" name="pk" title="Primary Key"></td>
            <td><input type="checkbox" name="unique" title="Unique Key"></td>
            <td><input type="checkbox" name="nullable" title="Nullable"></td>
            <td><input type="checkbox" name="autoIncrement" title="Auto Increment"></td>
            <td><input type="text" class="small" name="defaultValue" placeholder="기본값"></td>
        `;

        // 통합 이벤트 리스너 (이벤트 위임)
        tr.addEventListener('change', (e) => {
            const { name, type, checked, value } = e.target;
            if (!name) return;

            try {
                // Proxy에 값 대입 (예약어 체크나 고정 속성 에러가 여기서 발생함)
                this.column[name] = (type === 'checkbox') ? checked : value;
            } catch (error) {
                alert(error.message);
                this.render();
            }
        });

        // kok-input-filter 적용
        if (typeof KokInputFilter !== 'undefined') {
            new KokInputFilter(tr.querySelector('[name="name"]'), { type: 'variable', required: true });
            new KokInputFilter(tr.querySelector('[name="length"]'), { type: 'int' });
        }

        return tr;
    }
    render() {
        const inputs = this.element.querySelectorAll('input, select');
        const typeMeta = Column.TYPES[this.column.type.toUpperCase()] || {};

        inputs.forEach(elem => {
            const name = elem.name;
            const value = this.column[name];

            if (elem.type === 'checkbox') {
                elem.checked = value;
            } else {
                elem.value = value ?? '';
            }

            const fixedKey = `fixed${name.charAt(0).toUpperCase() + name.slice(1)}`;
            let isDisabled = this.column[fixedKey] === true || typeMeta[fixedKey] === true;
            if (name === 'length' && !typeMeta.hasLength) {
                isDisabled = true;
            }
            if (name === 'precision' && !typeMeta.hasPrecision) {
                isDisabled = true;
            }

            elem.disabled = isDisabled;
        });
    }
}



class SchemaComponent {
    constructor(schema) {
        this.schema = schema;
        // this.schema.onChange = (key, value) => {
        //     console.log('onChange', key, value);
        //     this.render();
        // }

        this.element = this._createElement();
        this.table = this.element.querySelector('.kok-table');

        this._initDecorators();
        this._initEvents();

        this.render();
    }

    _createElement() {
        const container = document.createElement('article');
        container.className = 'schema-wrapper';
        container.innerHTML = `
            <article class="kok-input-group" data-layout="vertical" data-regexp="/^[a-zA-Z0-9_]+$/">
                <label class="kok-input-label" data-required-text="필수" data-required-type="badge">테이블명</label>
                <input type="text" name="tableName" class="kok-input-field" placeholder="테이블명을 입력해주세요" required>
                <span class="kok-input-field-required-msg">테이블명은 필수 입력 항목입니다.</span>
                <span class="kok-input-field-danger-msg">테이블명은 영문, 숫자만 입력 가능합니다.</span>
                <span class="kok-input-field-success-msg">좋습니다!</span>
            </article>

            <!-- <article class="kok-input-group" data-layout="vertical" data-regexp="/^[a-zA-Z0-9 ]+$/"> -->
            <article class="kok-input-group" data-layout="vertical">
                <label class="kok-input-label">테이블 설명</label>
                <input type="text" name="tableDescription" class="kok-input-field" placeholder="테이블 설명을 입력해주세요">
                <span class="kok-input-field-danger-msg">테이블 설명은 영문, 숫자, 공백만 입력 가능합니다.</span>
                <span class="kok-input-field-success-msg">좋습니다!</span>
            </article>

            <article class="card-layout">
                <article class="table-container">
                    <table class="kok-table">
                        <colgroup>
                            <col width="*">
                            <col width="*">
                            <col width="200">
                            <col width="200">
                            <col width="200">
                            <col width="200">
                            <col width="200">
                            <col width="120">
                            <col width="120">
                            <col width="120">
                            <col width="200">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>컬럼명</th>
                                <th>코멘트</th>
                                <th>타입</th>
                                <th>길이</th>
                                <th>PK</th>
                                <th>유니크</th>
                                <th>NULLABLE</th>
                                <th>자동 증가</th>
                                <th>디폴트</th>
                            </tr>
                        </thead>

                        <tbody>
                        </tbody>
                    </table>
                </article>
            </article>`;

        return container;
    }

    _initDecorators() {
        this.tableDecorator = new KokTableDecorator(this.table);

        if (typeof KokInputDecorator !== 'undefined') {
            new KokInputDecorator().init();
        }
        if (typeof KokInputFilter !== 'undefined') {
            new KokInputFilter(this.element.querySelector('[name=tableName]'), { regexp: /[^a-zA-Z0-9_]/g, required: true });
        }
    }

    _initEvents() {
        this.element.querySelector('[name=tableName]').addEventListener('change', e => {
            try {
                this.schema.name = e.target.value;
            } catch (err) {
                alert(err.message);
                e.target.value = this.schema.name || '';
            }
        });

        this.element.querySelector('[name=tableDescription]').addEventListener('change', (e) => {
            try {
                this.schema.comment = e.target.value;
            } catch (err) {
                alert(err.message);
                e.target.value = this.schema.comment || '';
            }
        });

        this.table.addEventListener('add', (e) => {
            console.log(e);
            const column = this.schema.addColumn();
            if (this.schema.columns.length == 1) {
                column.name = 'ID';
                column.comment = '아이디';
                column.type = 'NUMERIC';
                column.autoIncrement = true;
                column.pk = true;
            }
            console.log(this.schema)
            const colComp = new ColumnComponent(column);
            
            this.table.tBodies[0].appendChild(colComp.element);
            
            this.tableDecorator.decorateRow(this.table, colComp.element);
            this.tableDecorator.reorderNumbers(this.table);
        });

        this.table.addEventListener('delete', (e) => {
            const deletedRows = e.detail?.deletedRows || [];
            deletedRows.sort((a, b) => b.index - a.index).forEach(obj => {
                this.schema.removeColumn(obj.index);
            });
        });

        this.table.addEventListener('swap', (e) => {
            const swapRows = e.detail?.swapRows || [];
            if (swapRows.length === 2) {
                const a = swapRows[0].index, b = swapRows[1].index;
                [this.schema.columns[a], this.schema.columns[b]] = [this.schema.columns[b], this.schema.columns[a]];
            }
        });
    }
    render() {
        // 1. 테이블 기본 정보 동기화 (값이 다를 때만 업데이트하여 포커스 유지)
        const nameInput = this.element.querySelector('[name=tableName]');
        const descInput = this.element.querySelector('[name=tableDescription]');

        if (nameInput && nameInput.value !== this.schema.name) {
            nameInput.value = this.schema.name || '';
        }
        if (descInput && descInput.value !== this.schema.comment) {
            descInput.value = this.schema.comment || '';
        }

        // 2. 컬럼 목록 동기화 (데이터 개수와 UI 행 개수를 비교하여 '증분' 처리)
        const currentRows = Array.from(this.table.tBodies[0].rows);
        const targetData = this.schema.columns;

        // 데이터 개수에 맞춰 UI 행을 추가하거나 삭제
        if (currentRows.length !== targetData.length) {
            this.table.tBodies[0].innerHTML = ''; // 간단하게 전체 초기화 후 다시 그리기
            targetData.forEach(column => {
                const colComp = new ColumnComponent(column);
                this.table.tBodies[0].appendChild(colComp.element);
                this.tableDecorator.decorateRow(this.table, colComp.element);
            });
            this.tableDecorator.reorderNumbers(this.table);
        }
    }
}

