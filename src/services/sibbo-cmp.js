import SibboI18n from '../services/sibbo-i18n';
const BOTS_REGEX = /bot|Chrome-Lighthouse|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i;

export default class SibboCMP {
    static init(configParams) {
        const isBotCmp = BOTS_REGEX.test(navigator.userAgent);
        if (isBotCmp || this._CMPInserted()) { return }

        const { locale } = configParams;
        SibboI18n.init(locale);

        let visible = true;
        this._initialState(visible);
    }

    static _initialState(visible) {
        this.insertLayout(visible);
    }

    static insertLayout(visible) {
        if (document.body) {
            const layout = document.createElement('sibbo-cmp-layout');

            if (visible) { layout.setAttribute('style', 'display: block;') }

            document.body.appendChild(layout);

            // this._insertOpenLink(visible);
        } else {
            setTimeout(this.insertLayout, 5);
        }
    }

    static _CMPInserted() {
        const cmpLayout = document.querySelector('sibbo-cmp-layout');

        return !!cmpLayout;
    }
    
    static close() {
        const layout = document.querySelector('sibbo-cmp-layout');

        if (layout) {
            layout.setAttribute('style', 'display: none;');
        };
    }

    static isOpen() {
        const isCmpOpen = document.querySelector('sibbo-cmp-layout').style.display === 'none';
        return !isCmpOpen;
    }

    static open() {
        const layout = document.querySelector('sibbo-cmp-layout');
        const isClosed = layout.style.display === 'none';

        if (isClosed) {
            layout.style.display = 'block';
        }
    }
}