import SibboI18n from '../../../services/sibbo-i18n';
import html from './index.html';
import Storage from '../../../storage/storage';

const template = document.createElement('template');

export default class SibboConsentSwitcher extends HTMLElement {
    connectedCallback() {
        const initialValue = Storage.getString('sibbo-cmp-logo');
        this._insertTemplate();
        this.appendChild(template.content.cloneNode(true));

        this._setAttributes();
        
        if (initialValue.length) {
            let optInOut = initialValue.split('')[2];
            optInOut = optInOut === 'Y' ? '1' : '0';
            this._setDefaultValue(initialValue);
        }
    }

    disconnectedCallback() {
        this._removeEvents();
    }

    _insertTemplate() {
        const {t} = SibboI18n;
        template.innerHTML = html({
            yes: t('consentSwitcher.yes'),
            no: t('consentSwitcher.no')
        })
    }

    _setAttributes() {
        const accepted = this.querySelector('input[value="1"]');
        const rejected = this.querySelector('input[value="0"]');

        accepted.setAttribute('id', 'optOut');
        rejected.setAttribute('id', 'optIn');

        accepted.nextElementSibling.setAttribute('for', 'optOut');
        rejected.nextElementSibling.setAttribute('for', 'optIn');

        accepted.addEventListener('click', () => {
            rejected.checked = false;
            this.dispatchEvent(new CustomEvent('opt-out', {
                bubbles: true,
            }))
        });

        rejected.addEventListener('click', () => {
            accepted.checked = false;
            this.dispatchEvent(new CustomEvent('opt-in', {
                bubbles: true,
            }))
        });
    }

    _removeEvents() {
        const accepted = this.querySelector('input[value="1"]');
        const rejected = this.querySelector('input[value="0"]');

        accepted.removeEventListener('click', this._inputChecked);
        rejected.removeEventListener('click', this._inputChecked);
    }

    _inputChecked(other, event) {
        other.checked = false;
        this.dispatchEvent(new CustomEvent(event, {
            bubbles: true,
        }))
    }

    _setDefaultValue(storedValue) {
        const input = this.querySelector(`input[value="${storedValue}"]`);
        if (input) {
            input.checked = true;
        }
    }
}