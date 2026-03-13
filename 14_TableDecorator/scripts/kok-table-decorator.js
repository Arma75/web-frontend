class KokTableDecorator {
    static DEFAULT_OPTIONS = Object.freeze({
        checkbox: true,
        number: true,
        add: true,
        delete: true,
        swap: true,
        rowTemplate: null,
    });

    constructor(element, userOptions = {}) {
        this.options = { ...KokTableDecorator.DEFAULT_OPTIONS, ...userOptions };

        if (typeof element === 'string') {
            this.targets = document.querySelectorAll(element);
        } else {
            this.targets = [element];
        }

        if (this.targets.length > 0) {
            this._init();
        }
    }
    
    _init() {
        this.targets.forEach((target, i) => {
            target._headerRows = this._getHeaderRows(target);
            target._headerSet = new Set(target._headerRows);
            target._headerCount = target._headerRows.length;

            if (this.options.checkbox) {
                this._addCheckboxes(target);
            }
            if (this.options.number) {
                this._addNumbers(target);
            }

            this._renderControls(target);
        });
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
        if (this.options.add) {
            const addButton = document.createElement('button');
            addButton.classList.add('kok-row-add-button', 'small', 'success');
            addButton.innerText = '추가';
            addButton.onclick = () => {
                if (!this.options.rowTemplate) {
                    this._dispatchEvent(element, 'addRow');
                    return;
                }
                
                const newRow = document.createElement('tr');
                newRow.innerHTML = this.options.rowTemplate; 
                
                const tbody = element.querySelector('tbody') || element;
                tbody.appendChild(newRow);
                
                this.decorateRow(element, newRow);
                this._reorderNumbers(element);

                this._dispatchEvent(element, 'addRow', { newRow });
            };
            controls.appendChild(addButton);
        }

        // 삭제 버튼
        if (this.options.delete) {
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
        if (this.options.swap) {
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
        if (this.options.checkbox) {
            this._addCheckbox(element, row);
        }
        if (this.options.number) {
            this._addNumber(row);
        }
    }
}