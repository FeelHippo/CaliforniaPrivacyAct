import "core-js/stable";
import "regenerator-runtime/runtime";
import html from './index.html';
import css from './index.scss';

import SibboCMP from '../../services/sibbo-cmp';
import SibboI18n from '../../services/sibbo-i18n';
import { addLogo } from '../layout';

const template = document.createElement('template');

class SibboCMPLayout extends HTMLElement {
    connectedCallback() {
        this._insertTemplate();

        this.appendChild(template.content.cloneNode(true));

        // addStyle(this);
        addLogo();
        // this._setEventHandlers();

        if (this.style.display !== 'none') {
            this._addEvents();
        }

        this.consentSubmitted = false;
    }

    disconnectedCallback() {
        this._removeEvents();
    }

    static get observedAttributes() {
        return ['style']
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'style') {
            if (newValue === 'display: none;') {
                // this._removeEvents();
            } else {
                // this._addEvents();
                // add focus tag event
            }
        }
    }

    _insertTemplate() {
        const {t} = SibboI18n;

        template.innerHTML = `
            <style>${css}</style>${
                html({
                    mainText: t('layout.mainText'),
                    acceptAll: t('layout.acceptAll'),
                    rejectAll: t('layout.rejectAll'),
                    accept: t('layout.accept'),
                    saveAndExit: t('layout.saveAndExit'),
                    moreOptions: t('layout.moreOptions'),
                })
            }
        `
    }
    
    _addEvents() {
        this.addEventListener('click', event => {
            const {target} = event;
            if (target.hasAttribute('data-accept-all')) {
                this._handleAcceptAll(event);
            } else if (target.hasAttribute('data-save-and-exit')) {
                this._handleSaveAndExit(event);
            } else if (target.hasAttribute('data-close')) {
                event.preventDefault();
                SibboCMP.close();
            }
        })
    }

    _handleAcceptAll(event) {
        event.preventDefault();
        // implement the following methods
        acceptEmptyData();
        saveAndExit();

        this.consentSubmitted = true;
    }

    _handleSaveAndExit(event) {
        // when and where is this set to disabled
        const buttonDisabled = event.target.classList.contains('sibbo-cmp-button--disabled');

        if (!buttonDisabled) {
            event.preventDefault();

            acceptEmptyData();
            saveAndExit();

            this.consentSubmitted = true;
        }
    }
}

export default () => {
    
    const register = () => {
        customElements.define('sibbo-cmp-layout', SibboCMPLayout);
    };
    window.WebComponents ? window.WebComponents.waitFor(register) : register();
}