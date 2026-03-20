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
    
    _init() {
        this.targets.forEach((target, i) => {
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

            // 체크박스 생성
            if (this.checkbox) {
                this._createCheckbox(target);
            }

            // target._headerRows = this._getHeaderRows(target);
            // target._headerSet = new Set(target._headerRows);
            // target._headerCount = target._headerRows.length;

            // if (this.checkbox) {
            //     this._addCheckboxes(target);
            // }
            // if (this.number) {
            //     this._addNumbers(target);
            // }

        
            target.dataset.kokDecorated = 'true';

            // this._renderControls(target);
        });
    }
    
    _createAddButton(element) {
        const toolbar = element._wrapper.querySelector('.kok-table-toolbar');

        const button = document.createElement('button');
        button.className = 'kok-row-add-button small success';
        button.innerText = '추가';
        button.onclick = () => {
            if (!this.template) {
                this._dispatchEvent(element, 'add');
                return;
            }
            
            const newRow = document.createElement('tr');
            newRow.innerHTML = this.template; 
            
            const tbody = element.tBodies[0];
            tbody.appendChild(newRow);
            
            // this.decorateRow(element, newRow);
            // this._reorderNumbers(element);

            this._dispatchEvent(element, 'add', { newRow });
        };

        toolbar.appendChild(button);
    }
    
    _createDeleteButton(element) {
        const toolbar = element._wrapper.querySelector('.kok-table-toolbar');

        const button = document.createElement('button');
        button.className = 'kok-row-delete-button small danger';
        button.innerText = '삭제';
        button.onclick = () => {
            const deletedRows = [];
            element.querySelectorAll('.kok-check:checked').forEach(checkbox => {
                const row = checkbox.closest('tr');
                deletedRows.push({
                    row: row,
                    index: row.rowIndex - 1
                });
            });
            
            deletedRows.forEach(obj => obj.row.remove());

            this._dispatchEvent(element, 'delete', { deletedRows });
        };

        toolbar.appendChild(button);
    }
    
    _createSwapButton(element) {
        const toolbar = element._wrapper.querySelector('.kok-table-toolbar');

        const button = document.createElement('button');
        button.className = 'kok-row-swap-button small info';
        button.innerText = '교체';
        button.onclick = () => {
            const swapRows = [];
            const checkedRows = Array.from(element.querySelectorAll('.kok-check:checked')).map(checkbox => {
                const row = checkbox.closest('tr');
                swapRows.push({
                    row: row,
                    index: row.rowIndex - 1
                });

                return row;
            });

            if (checkedRows.length !== 2) {
                this._dispatchEvent(element, 'swap');
                return;
            }
            
            let [a, b] = checkedRows;
            if (a.compareDocumentPosition(b) === Node.DOCUMENT_POSITION_PRECEDING) {
                [a, b] = [b, a];
            }
            
            const temp = document.createElement('tr');
            a.parentNode.insertBefore(temp, a);
            b.parentNode.insertBefore(a, b);
            temp.parentNode.insertBefore(b, temp);
            temp.remove();
            
            this._dispatchEvent(element, 'swap', { swapRows });
        };

        toolbar.appendChild(button);
    }

    _getHeaderRows(element) {
        // thead가 있는 경우 thead 기준으로 헤더 추출
        // thead가 없는 경우 첫번째 로우부터 연속된 th 기준으로 헤더 추출
        const thead = element.querySelector('thead');
        if (thead) {
            return thead.querySelectorAll('tr');
        }

        let headerRows = [];
        const allRows = Array.from(element.rows);
        for (let row of allRows) {
            if (!row.querySelector('th')) {
                break;
            }

            headerRows.push(row);
        }
        
        return headerRows;
    }

    _uncheckBoxes(element) {
        const allCheckBox = element.querySelector('.kok-all-check');
        allCheckBox.checked = false;

        const checkboxes = element.querySelectorAll('.kok-check');
        checkboxes.forEach(checkbox => checkbox.checked = false);

        this._updateButtonState(element);
    }

    _updateButtonState(element) {
        const controls = element.previousElementSibling;
        if (!controls || !controls.classList.contains('kok-controls')) {
            return;
        }
        
        const checkCount = element.querySelectorAll('.kok-check:checked').length;
        const deleteButton = controls.querySelector('.kok-row-delete-button');
        const swapButton = controls.querySelector('.kok-row-swap-button');
        if (deleteButton) {
            deleteButton.disabled = checkCount == 0;
        }
        if (swapButton) {
            swapButton.disabled = checkCount != 2;
        }
    }

    _addCheckbox(tableElem, row) {
        const td = document.createElement('td');
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'kok-check';
        check.onclick = _ => {
            const checkboxes = tableElem.querySelectorAll('.kok-check');
            const checkCount = tableElem.querySelectorAll('.kok-check:checked').length;
            const isAllChecked = checkboxes.length == checkCount;
            const allCheckBox = tableElem.querySelector('.kok-all-check');

            allCheckBox.checked = isAllChecked;
            
            this._updateButtonState(tableElem);
        };
        
        td.appendChild(check);
        row.insertBefore(td, row.firstChild);
    }

    _addNumber(row) {
        const td = document.createElement('td');
        const number = document.createElement('span');
        number.innerText = '0';
        number.className = 'kok-number';
        
        td.appendChild(number);
        row.insertBefore(td, row.firstChild);
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
            this._addCheckbox(element, row);
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

    _addCheckboxes(element) {
        // 전체 체크박스 추가
        const allCheck = document.createElement('input');
        allCheck.type = 'checkbox';
        allCheck.className = 'kok-all-check';
        allCheck.onclick = (e) => {
            const isChecked = e.target.checked;
            const checkboxes = element.querySelectorAll('.kok-check');

            checkboxes.forEach(checkbox => checkbox.checked = isChecked);
            
            this._updateButtonState(element);
        };

        const allCheckTh = document.createElement('th');
        allCheckTh.rowSpan = element._headerCount;
        allCheckTh.style.width = '56px';
        allCheckTh.appendChild(allCheck);
        element._headerRows[0].insertBefore(allCheckTh, element._headerRows[0].firstChild);

        // 로우별 체크박스 추가
        const allRows = Array.from(element.rows);
        allRows.forEach(row => {
            if (element._headerSet.has(row)) {
                return;
            }
            if (row.closest('tfoot')) {
                return false;
            }

            this._addCheckbox(element, row);
        });
    }

    _addNumbers(element) {
        // 번호 헤더 추가
        const numberHeader = document.createElement('span');
        numberHeader.innerText = 'No.';

        const numberTh = document.createElement('th');
        numberTh.rowSpan = element._headerCount;
        numberTh.appendChild(numberHeader);
        numberTh.style.width = '80px';
        element._headerRows[0].insertBefore(numberTh, element._headerRows[0].firstChild);

        // 로우별 번호 추가
        const allRows = Array.from(element.rows);
        allRows.forEach(row => {
            if (element._headerSet.has(row)) {
                return;
            }
            if (row.closest('tfoot')) {
                return false;
            }

            this._addNumber(row);
        });

        this._reorderNumbers(element);
    }

    _dispatchEvent(element, eventName, data) {
        element.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }

    _renderControls(element) {
        const controls = document.createElement('div');
        controls.className = 'kok-controls';
        controls.style.display = 'flex';
        controls.style.justifyContent = 'flex-end';
        controls.style.gap = '8px';
        controls.style.marginBottom = '8px';

        // 추가 버튼
        if (this.add) {
            const addButton = document.createElement('button');
            addButton.classList.add('kok-row-add-button', 'small', 'success');
            addButton.innerText = '추가';
            addButton.onclick = () => {
                if (!this.template) {
                    this._dispatchEvent(element, 'addRow');
                    return;
                }
                
                const newRow = document.createElement('tr');
                newRow.innerHTML = this.template; 
                
                const tbody = element.querySelector('tbody') || element;
                tbody.appendChild(newRow);
                
                this.decorateRow(element, newRow);
                this._reorderNumbers(element);

                this._dispatchEvent(element, 'addRow', { newRow });
            };
            controls.appendChild(addButton);
        }

        // 삭제 버튼
        if (this.delete) {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('kok-row-delete-button', 'small', 'danger');
            deleteButton.innerText = '삭제';
            deleteButton.disabled = true;
            deleteButton.onclick = () => {
                const deletedRows = [];
                element.querySelectorAll('.kok-check:checked').forEach(checkbox => {
                    const row = checkbox.closest('tr');
                    deletedRows.push({
                        row: row,
                        index: row.rowIndex - 1
                    });
                });
                
                deletedRows.forEach(obj => obj.row.remove());

                // 번호 다시 세팅
                this._reorderNumbers(element);
                this._uncheckBoxes(element);

                this._dispatchEvent(element, 'deleteRow', { deletedRows });
            };
            controls.appendChild(deleteButton);
        }

        // 순서 변경 버튼
        if (this.swap) {
            const swapButton = document.createElement('button');
            swapButton.classList.add('kok-row-swap-button', 'small', 'info');
            swapButton.innerText = '교체';
            swapButton.disabled = true;
            swapButton.onclick = () => {
                const swapRows = [];
                const checkedRows = Array.from(element.querySelectorAll('.kok-check:checked')).map(checkbox => {
                    const row = checkbox.closest('tr');
                    swapRows.push({
                        row: row,
                        index: row.rowIndex - 1
                    });

                    return row;
                });

                if (checkedRows.length !== 2) {
                    this._dispatchEvent(element, 'swapRow');
                    return;
                }
                
                let [a, b] = checkedRows;
                if (a.compareDocumentPosition(b) === Node.DOCUMENT_POSITION_PRECEDING) {
                    [a, b] = [b, a];
                }
                
                const temp = document.createElement('tr');
                
                a.parentNode.insertBefore(temp, a);
                b.parentNode.insertBefore(a, b);
                temp.parentNode.insertBefore(b, temp);

                temp.remove();

                this._reorderNumbers(element);
                this._uncheckBoxes(element);
                
                this._dispatchEvent(element, 'swapRow', { swapRows });
            };
            controls.appendChild(swapButton);
        }

        element.parentNode.insertBefore(controls, element);
    }

    _reorderNumbers(element) {
        let num = 1;
        element.querySelectorAll('.kok-number').forEach(span => {
            span.innerText = num++;
        });
    }

    decorateRow(element, row) {
        if (this.checkbox) {
            this._addCheckbox(element, row);
        }
        if (this.number) {
            this._addNumber(row);
        }
    }
}