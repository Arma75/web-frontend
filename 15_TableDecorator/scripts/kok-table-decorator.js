class DomUtil {
    /**
     * 입력 값을 기반으로 DOM 요소 리스트를 반환합니다.
     * @param {string|NodeList|HTMLCollection|HTMLElement|Array} input 
     * @returns {Element[]}
     */
    static toElementArray(input) {
        if (!input) {
            return [];
        }

        if (typeof input === 'string') {
            return Array.from(document.querySelectorAll(input));
        }

        if (input instanceof NodeList || input instanceof HTMLCollection) {
            return Array.from(input);
        }

        if (input instanceof HTMLElement) {
            return [input];
        }

        if (Array.isArray(input)) {
            return input.filter(item => item instanceof HTMLElement);
        }

        return [];
    }
}

class KokTableDecorator {
    static DEFAULT_OPTIONS = Object.freeze({
        checkbox: true,
        number: true,
        add: true,
        delete: true,
        swap: true,
        template: null,
    });

    constructor(element, userOptions = {}) {
        // 속성 평탄화
        // this.options.checkbox => this.checkbox로 접근할 수 있도록 변경
        const options = { ...KokTableDecorator.DEFAULT_OPTIONS, ...userOptions };
        Object.assign(this, options);

        // 테이블 요소만 대상으로 지정
        this.targets = DomUtil.toElementArray(element).filter(el => el.tagName === 'TABLE');
        if (this.targets.length > 0) {
            this._init();
        }
    }
    
    _wrap(element) {
        const parent = element.parentNode;

        const wrapper = document.createElement('article');
        wrapper.className = 'kok-table-wrapper';
        parent.insertBefore(wrapper, element);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'kok-table-toolbar';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '8px';
        buttonContainer.style.marginBottom = '8px';
        wrapper.appendChild(buttonContainer);

        const tableContainer = document.createElement('div');
        tableContainer.className = 'kok-table-container';
        tableContainer.style.overflow = 'scroll';
        wrapper.appendChild(tableContainer);

        tableContainer.appendChild(element);

        element._wrapper = wrapper;
    }

    _normalize(element) {
        let thead = element.tHead;
        let tbody = element.tBodies[0];

        // thead가 없는 경우 thead 생성
        if (!thead) {
            thead = document.createElement('thead');

            // 연속된 th를 헤더 로우로 등록
            const rows = Array.from(element.rows);
            for (const row of rows) {
                if (!row.querySelector('th')) {
                    break;
                }
                
                thead.appendChild(row);
            }

            element.insertBefore(thead, element.firstChild);
        }

        // tbody가 없는 경우 tbody 생성
        if (!tbody) {
            tbody = document.createElement('tbody');
            
            Array.from(element.rows)
                .filter(row => !thead.contains(row))
                .forEach(row => tbody.appendChild(row));
            
            element.appendChild(tbody);
        }
    }
    
    _init() {
        this.targets.forEach(target => {
            if (target.dataset.kokDecorated === 'true') {
                return;
            }

            // 외부 구조 생성
            this._wrap(target);
            // 테이블 구조 정규화
            this._normalize(target);

            // 추가 버튼 생성
            if (this.add) {
                this._createAddButton(target);
            }
            // 삭제 버튼 생성
            if (this.delete) {
                this._createDeleteButton(target);
            }
            // 교체 버튼 생성
            if (this.swap) {
                this._createSwapButton(target);
            }

            // 숫자 생성
            if (this.number) {
                this._createNumber(target);
            }
            // 체크박스 생성
            if (this.checkbox) {
                this._createCheckbox(target);
            }
        
            target.dataset.kokDecorated = 'true';
        });
    }
    
    _createAddButton(element) {
        const toolbar = element._wrapper.querySelector('.kok-table-toolbar');

        const button = document.createElement('button');
        button.className = 'kok-row-add-button small success';
        button.innerText = '추가';
        button.onclick = () => {
            if (!this.template) {
                element.dispatchEvent(new CustomEvent('add'));
                return;
            }
            
            const newRow = document.createElement('tr');
            newRow.innerHTML = this.template; 
            
            const tbody = element.tBodies[0];
            tbody.appendChild(newRow);
            
            this.decorateRow(element, newRow);
            this.reorderNumbers(element);
            element.querySelector('.kok-all-check').checked = false;

            element.dispatchEvent(new CustomEvent('add', { detail: newRow }));
        };

        toolbar.appendChild(button);
    }
    
    _createDeleteButton(element) {
        const toolbar = element._wrapper.querySelector('.kok-table-toolbar');

        const button = document.createElement('button');
        button.disabled = true;
        button.className = 'kok-row-delete-button small danger';
        button.innerText = '삭제';
        button.onclick = () => {
            const checkedRows = Array.from(element.querySelectorAll('.kok-check:checked'));
            if (checkedRows.length < 1) {
                element.dispatchEvent(new CustomEvent('delete'));
                return;
            }

            const deletedRows = [];
            checkedRows.forEach(checkbox => {
                const row = checkbox.closest('tr');
                deletedRows.push({
                    row: row,
                    index: row.rowIndex - 1
                });
            });
            
            deletedRows.forEach(obj => obj.row.remove());
            this.reorderNumbers(element);
            this._uncheckBoxes(element);

            element.dispatchEvent(new CustomEvent('delete', { detail: deletedRows }));
        };

        toolbar.appendChild(button);
    }
    
    _createSwapButton(element) {
        const toolbar = element._wrapper.querySelector('.kok-table-toolbar');

        const button = document.createElement('button');
        button.disabled = true;
        button.className = 'kok-row-swap-button small info';
        button.innerText = '교체';
        button.onclick = () => {
            const checkedRows = Array.from(element.querySelectorAll('.kok-check:checked'));
            if (checkedRows.length !== 2) {
                element.dispatchEvent(new CustomEvent('swap'));
                return;
            }

            const swapRows = [];
            checkedRows.forEach(checkbox => {
                const row = checkbox.closest('tr');
                swapRows.push({
                    row: row,
                    index: row.rowIndex - 1
                });

                return row;
            });
            
            let [a, b] = swapRows.map(obj => obj.row);
            if (a.compareDocumentPosition(b) === Node.DOCUMENT_POSITION_PRECEDING) {
                [a, b] = [b, a];
            }
            
            const temp = document.createElement('tr');
            a.parentNode.insertBefore(temp, a);
            b.parentNode.insertBefore(a, b);
            temp.parentNode.insertBefore(b, temp);
            temp.remove();
            
            this.reorderNumbers(element);
            this._uncheckBoxes(element);
            
            element.dispatchEvent(new CustomEvent('swap', { detail: swapRows }));
        };

        toolbar.appendChild(button);
    }

    _createCheckbox(element) {
        // 헤더 (전체 선택) 체크박스 생성
        const allCheck = document.createElement('input');
        allCheck.type = 'checkbox';
        allCheck.className = 'kok-all-check';
        allCheck.onclick = e => {
            const isChecked = e.target.checked;
            element.querySelectorAll('.kok-check').forEach(cb => cb.checked = isChecked);

            this._updateButtonState(element);
        };

        const th = document.createElement('th');
        th.rowSpan = element.tHead.rows.length;
        th.style.width = '56px';
        th.appendChild(allCheck);
        
        // 첫 번째 헤더 로우의 맨 앞에 삽입
        element.tHead.rows[0].insertBefore(th, element.tHead.rows[0].firstChild);

        // 바디 체크박스 생성
        Array.from(element.tBodies[0].rows).forEach(row => {
            this._createCheckboxByRow(element, row);
        });
    }
    _createCheckboxByRow(table, row) {
        const td = document.createElement('td');
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'kok-check';
        check.onclick = _ => {
            const checkboxes = table.querySelectorAll('.kok-check');
            const checkCount = table.querySelectorAll('.kok-check:checked').length;
            const isAllChecked = checkboxes.length == checkCount;
            const allCheckBox = table.querySelector('.kok-all-check');

            allCheckBox.checked = isAllChecked;
            
            this._updateButtonState(table);
        };
        
        td.appendChild(check);
        row.insertBefore(td, row.firstChild);
    }

    _createNumber(element) {
        // 헤더 (전체 선택) 체크박스 생성
        const numberHeader = document.createElement('span');
        numberHeader.innerText = 'No.';

        const numberTh = document.createElement('th');
        numberTh.rowSpan = element.tHead.rows.length;
        numberTh.style.width = '56px';
        numberTh.appendChild(numberHeader);
        element.tHead.rows[0].insertBefore(numberTh, element.tHead.rows[0].firstChild);

        // 바디 넘버 생성
        Array.from(element.tBodies[0].rows).forEach(row => {
            this._createNumberByRow(element, row);
        });
    }
    _createNumberByRow(table, row) {
        const td = document.createElement('td');
        const number = document.createElement('span');
        number.className = 'kok-number';
        number.innerText = row.rowIndex - table.tHead.rows.length + 1;
        
        td.appendChild(number);
        row.insertBefore(td, row.firstChild);
    }

    _updateButtonState(element) {
        const toolbar = element._wrapper.querySelector('.kok-table-toolbar');
        if (!toolbar) {
            return;
        }

        const checkCount = element.querySelectorAll('.kok-check:checked').length;
        const deleteButton = toolbar.querySelector('.kok-row-delete-button');
        const swapButton = toolbar.querySelector('.kok-row-swap-button');
        if (deleteButton) {
            deleteButton.disabled = checkCount == 0;
        }
        if (swapButton) {
            swapButton.disabled = checkCount != 2;
        }
    }

    _uncheckBoxes(element) {
        const allCheckBox = element.querySelector('.kok-all-check');
        allCheckBox.checked = false;

        const checkboxes = element.querySelectorAll('.kok-check');
        checkboxes.forEach(checkbox => checkbox.checked = false);

        this._updateButtonState(element);
    }

    decorateRow(table, row) {
        // 숫자 생성
        if (this.number) {
            this._createNumberByRow(table, row);
        }
        // 체크박스 생성
        if (this.checkbox) {
            this._createCheckboxByRow(table, row);
        }
    }
    reorderNumbers(element) {
        let num = 1;
        element.querySelectorAll('.kok-number').forEach(span => {
            span.innerText = num++;
        });
    }
}