const DEFAULT_KOK_INPUT_FILTER_OPTIONS = {
    required: false,
    type: null,
    regexp: null,
    validate: null,
    selector: null,
    onError: null,
    onSuccess: null
};

const KOK_INPUT_FILTER_TYPES = {
    int: /[^0-9]/g,
    float: /[^0-9.]/g,
    alpha: /[^a-zA-Z]/g,
    lowercase: /[^a-z]/g,
    uppercase: /[^A-Z]/g,
    korean: /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g,
    variable: /[^a-zA-Z0-9_]/g,
};

const KOK_INPUT_FILTER_VALIDATE_TYPES = {
    email: {
        regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        msg: '올바른 이메일 형식이 아닙니다.'
    },
    date: { 
        regexp: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 
        msg: '날짜 형식(YYYY-MM-DD)이 올바르지 않습니다.' 
    },
    datetime: { 
        regexp: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/, 
        msg: '일시 형식(YYYY-MM-DD HH:mm:ss)이 올바르지 않습니다.' 
    }
};

class KokInputFilter {
    constructor(element, userOptions = {}) {
        this.options = Object.assign({}, DEFAULT_KOK_INPUT_FILTER_OPTIONS, userOptions);

        if (typeof element === 'string') {
            this.target = document.querySelector(element);
        } else {
            this.target = element;
        }

        if (this.target) {
            this._init();
        }
    }

    _init() {
        const isTextField = this.target.tagName === 'INPUT' || this.target.tagName === 'TEXTAREA';

        if (isTextField) {
            this.target.addEventListener('input', this._filter.bind(this));
            this.target.addEventListener('blur', this._validate.bind(this));
        } else {
            this.target.addEventListener('input', (e) => {
                if (this._isTarget(e.target)) {
                    this._filter(e);
                }
            });
            this.target.addEventListener('focusout', (e) => {
                if (this._isTarget(e.target)) {
                    this._validate(e);
                }
            });
        }
    }
    
    _isTarget(element) {
        return element.matches(this.options.selector || 'input, textarea');
    }

    _filter(e) {
        let val = e.target.value;

        if (KOK_INPUT_FILTER_TYPES[this.options.type]) {
            e.target.value = val.replace(KOK_INPUT_FILTER_TYPES[this.options.type], '');
        } else if (this.options.regexp) {
            e.target.value = val.replace(this.options.regexp, '');
        }
    }

    _validate(e) {
        const el = e.target;
        const value = e.target.value;

        let isValid = true;
        let msg = "";

        if (this.options.required && value === "") {
            isValid = false;
            msg = "필수 입력 항목입니다.";
        } else if (value !== '') {
            if (KOK_INPUT_FILTER_VALIDATE_TYPES[this.options.type]) {
                isValid = KOK_INPUT_FILTER_VALIDATE_TYPES[this.options.type].regexp.test(value);
                msg = KOK_INPUT_FILTER_VALIDATE_TYPES[this.options.type].msg;
            } else if (this.options.validate && this.options.validate.regexp) {
                isValid = this.options.validate.regexp.test(value);
                msg = this.options.validate.msg;
            }
        } else {
            el.removeAttribute('data-status');
            return;
        }

        el.setAttribute('data-status', isValid? 'success' : 'error');

        const eventName = isValid? 'success' : 'error';
        const event = new CustomEvent(eventName, {
            detail: { el: el, message: msg, type: this.options.type }
        });
        el.dispatchEvent(event);

        if (isValid) {
            if (typeof this.options.onSuccess === 'function') {
                this.options.onSuccess(el);
            }
        } else {
            if (typeof this.options.onError === 'function') {
                this.options.onError(el, msg);
            }
        }
    }
}