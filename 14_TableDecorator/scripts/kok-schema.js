class Column {
    static TYPES = Object.freeze({
        CHAR: { hasLength: true, hasPrecision: false },
        VARCHAR: { hasLength: true, hasPrecision: false },
        TEXT: { hasLength: false, hasPrecision: false },
        INTEGER: { hasLength: false, hasPrecision: false },
        NUMERIC: { hasLength: false, hasPrecision: true },
        TIMESTAMP: { hasLength: false, hasPrecision: true },
        BOOLEAN: { hasLength: false, hasPrecision: false },
    });

    static DEFAULT_OPTIONS = Object.freeze({
        name: null,
        comment: null,
        type: 'VARCHAR',
        length: 100,
        precision: 0,
        defaultValue: null,
        isPK: false,
        isAutoIncrement: false,
        nullable: true,
    });

    constructor(userOptions = {}) {
        const self = this;

        this.onChange = null;
        this.options = new Proxy({ ...Column.DEFAULT_OPTIONS, ...userOptions }, {
            set: (target, prop, value) => {
                target[prop] = value;
                if (self.onChange) {
                    self.onChange(prop, value);
                }
                
                return true;
            }
        });
    }
}

class ColumnComponent {
    constructor(column) {
        this.column = column;
        this.column.onChange = (key, value) => this._updateUI(key, value);
        this.element = this._createElement();
    }

    _createElement() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="small" name="name"></td>
            <td><input type="text" class="small" name="comment"></td>
            <td>
                <select class="small" name="type">
                    ${Object.keys(Column.TYPES).map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
            </td>
            <td><input type="text" class="small" name="length"></td>
            <td><input type="text" class="small" name="defaultValue"></td>
            <td><input type="checkbox" name="isPK"></td>
            <td><input type="checkbox" name="isAutoIncrement"></td>
            <td><input type="checkbox" name="nullable"></td>
        `;

        // 초기 UI 이벤트 세팅
        Object.keys(this.column.options).forEach(key => {
            const element = tr.querySelector(`[name="${key}"]`);
            if (!element) {
                return;
            }

            this._updateUI(key, this.column.options[key], element);

            element.addEventListener('change', (e) => {
                const val = element.type === 'checkbox'? element.checked : element.value;
                this.column.options[key] = val;
            });
        });

        // 타입 변경 시 length 활성화 여부 조정
        const typeSelect = tr.querySelector('[name="type"]');
        const lengthInput = tr.querySelector('[name="length"]');
        const updateLengthState = (type) => {
            lengthInput.disabled = !Column.TYPES[type].hasLength;
        };
        typeSelect.addEventListener('change', (e) => updateLengthState(e.target.value));
        updateLengthState(this.column.options.type);

        new KokInputFilter(tr.querySelector('input[name="name"]'), { type: 'variable', required: true });
        new KokInputFilter(tr.querySelector('input[name="length"]'), { type: 'int', required: true });

        return tr;
    }

    // 데이터 변경 시 원천 데이터 업데이트
    _updateUI(key, value, targetElement) {
        const element = targetElement || this.element.querySelector(`[name="${key}"]`);
        if (!element) {
            return;
        }

        if (element.type === 'checkbox') {
            element.checked = value;
        } else {
            element.value = value;
        }
    }
}

class Schema {
    static DEFAULT_OPTIONS = Object.freeze({
        tableName: null,
        tableDescription: null,
        columns: [],
    });

    constructor(userOptions = {}) {
        const self = this;

        this.onChange = null;
        this.options = new Proxy({ ...Schema.DEFAULT_OPTIONS, ...userOptions }, {
            set: (target, prop, value) => {
                target[prop] = value;
                if (self.onChange) {
                    self.onChange(prop, value);
                }
                
                return true;
            }
        });
    }
}