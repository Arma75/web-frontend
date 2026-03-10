class KokInputDecorator {
    static STATUS = {
        SUCCESS: 'success',
        WARNING: 'warning',
        DANGER: 'danger',
        REQUIRED: 'required'
    };

    static FILTER_TYPES = {
        int: /^[0-9]+$/,
        float: /^[0-9.]+$/,
        alpha: /^[a-zA-Z]+$/,
        lowercase: /^[a-z]+$/,
        uppercase: /^[A-Z]+$/,
        korean: /^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/,
        variable: /^[a-zA-Z0-9_]+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 
        datetime: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 
    };

    constructor(userOptions = {}) {
        // 기본값 설정
        const defaultOptions = {
            inputSelector: '.kok-input-field',
            groupSelector: '.kok-input-group'
        };
        
        const options = { ...defaultOptions, ...userOptions };

        this.inputSelector = options.inputSelector;
        this.groupSelector = options.groupSelector;
    }

    init() {
        document.addEventListener('blur', e => {
            if (e.target.matches(this.inputSelector)) {
                this.validate(e.target);
            }
        }, true);
        
        document.addEventListener('input', (e) => {
            if (e.target.matches(this.inputSelector)) {
                const group = e.target.closest(this.groupSelector);
                this._clearStatus(group);
            }
        });
    }
    
    _parseRegExp(string) {
        if (!string) {
            return null;
        }

        // /abcd/g => abcd, g로 분리
        // 그렇지 않으면 \/abcd\/g로 적용됨
        const match = string.match(/^\/(.*)\/([a-z]*)$/);

        return match? new RegExp(match[1], match[2]) : new RegExp(string);
    }

    _clearStatus(group) {
        if (!group) {
            return;
        }
        group.classList.remove(...Object.values(KokInputDecorator.STATUS));

        const input = group.querySelector('.kok-input-field');
        if (!input) {
            return;
        }
        input.classList.remove(...Object.values(KokInputDecorator.STATUS));
    }

    validate(input) {
        // .kok-input-group 유무 체크
        const group = input.closest(this.groupSelector);
        if (!group) {
            return;
        }

        this._clearStatus(group);

        // type이 regexp보다 우선
        const isRequired = input.hasAttribute('required') || group.querySelector(this.inputSelector + '[required]');
        const value = input.value.trim();
        const isEmpty = value === "";

        // 필수 값 체크
        if (isEmpty && isRequired) {
            group.classList.add(KokInputDecorator.STATUS.REQUIRED);
            input.classList.add(KokInputDecorator.STATUS.DANGER);
            return;
        }

        // danger 체크
        const dangerType = group.dataset.type;
        const dangerRegexp = this._parseRegExp(group.dataset.regexp);
        if (dangerType) {
            if (KokInputDecorator.FILTER_TYPES[dangerType] && !KokInputDecorator.FILTER_TYPES[dangerType].test(value)) {
                group.classList.add(KokInputDecorator.STATUS.DANGER);
                input.classList.add(KokInputDecorator.STATUS.DANGER);
                return;
            }
        } else if (dangerRegexp && !dangerRegexp.test(value)) {
            group.classList.add(KokInputDecorator.STATUS.DANGER);
            input.classList.add(KokInputDecorator.STATUS.DANGER);
            return;
        }

        // warning 체크
        const warningType = group.dataset.validType;
        const warningRegexp = this._parseRegExp(group.dataset.validRegexp);
        if (warningType) {
            if (KokInputDecorator.FILTER_TYPES[warningType] && !KokInputDecorator.FILTER_TYPES[warningType].test(value)) {
                group.classList.add(KokInputDecorator.STATUS.WARNING);
                input.classList.add(KokInputDecorator.STATUS.WARNING);
                return;
            }
        } else if (warningRegexp && !warningRegexp.test(value)) {
            group.classList.add(KokInputDecorator.STATUS.WARNING);
            input.classList.add(KokInputDecorator.STATUS.WARNING);
            return;
        }

        if (!isEmpty) {
            group.classList.add(KokInputDecorator.STATUS.SUCCESS);
            input.classList.add(KokInputDecorator.STATUS.SUCCESS);
        }
    }
}