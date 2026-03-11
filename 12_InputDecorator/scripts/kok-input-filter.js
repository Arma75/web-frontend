class KokInputFilter {
    static STATUS = Object.freeze({
        SUCCESS: 'success',
        ERROR: 'error'
    });

    static DEFAULT_OPTIONS = Object.freeze({
        required: false,
        type: null,
        regexp: null,
        validate: null,
        selector: null
    });

    static INPUT_FILTER_TYPES = Object.freeze({
        int: /[^0-9]/g,
        float: /[^0-9.]/g,
        alpha: /[^a-zA-Z]/g,
        lowercase: /[^a-z]/g,
        uppercase: /[^A-Z]/g,
        korean: /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g,
        variable: /[^a-zA-Z0-9_]/g,
    });

    static BLUR_FILTER_TYPES = Object.freeze({
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        datetime: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) (0\d|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/
    });

    constructor(element, userOptions = {}) {
        this.options = { ...KokInputFilter.DEFAULT_OPTIONS, ...userOptions };

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

        if (KokInputFilter.INPUT_FILTER_TYPES[this.options.type]) {
            e.target.value = val.replace(KokInputFilter.INPUT_FILTER_TYPES[this.options.type], '');
        } else if (this.options.regexp) {
            e.target.value = val.replace(this.options.regexp, '');
        }
    }

    _validate(e) {
        const el = e.target;
        const value = e.target.value;

        let isValid = true;

        if (this.options.required && value === "") {
            isValid = false;
        } else if (value !== '') {
            if (KokInputFilter.BLUR_FILTER_TYPES[this.options.type]) {
                isValid = KokInputFilter.BLUR_FILTER_TYPES[this.options.type].test(value);
            } else if (this.options.validate && this.options.validate.regexp) {
                isValid = this.options.validate.regexp.test(value);
            }
        } else {
            el.removeAttribute('data-status');
            return;
        }

        el.setAttribute('data-status', isValid? KokInputFilter.STATUS.SUCCESS : KokInputFilter.STATUS.ERROR);

        const eventName = isValid? KokInputFilter.STATUS.SUCCESS : KokInputFilter.STATUS.ERROR;
        const event = new CustomEvent(eventName, {
            detail: {
                required: this.options.required,
                type: this.options.type,
                regexp: this.options.regexp,
                validate: this.options.validate,
                selector: this.options.selector
            }
        });
        el.dispatchEvent(event);
    }
}