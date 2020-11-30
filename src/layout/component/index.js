import "core-js/stable";
import "regenerator-runtime/runtime";
import html from './index.html';
import css from './index.scss';
import cmpConfiguration from '../../../cmp-configuration';

import SibboCMP from '../../services/sibbo-cmp';
import SibboI18n from '../../services/sibbo-i18n';
import { setUSPData } from '../layout';
import Storage from '../../storage/storage';
import { addLogo } from '../layout';

const template = document.createElement('template');

export default class SibboCMPLayout extends HTMLElement {
    connectedCallback() {
        // init component
        this._insertTemplate();
        // add layouts and consent switch, logo
        this.appendChild(template.content.cloneNode(true));
        this._addConsentSwitcher();
        addLogo();

        // true == optin, false == optout
        let optInOut = new Boolean();
        
        // read existing consent from local storage
        this._existingConsent();
        // event listeners
        this._setEventHandlers();

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

    _insertTemplate() {
        const {t} = SibboI18n;

        template.innerHTML = `
            <style>${css}</style>${
                html({
                    mainText: t('layout.mainText'),
                    confirm: t('layout.confirm'),
                    delete: t('layout.delete'),
                    saveAndExit: t('layout.saveAndExit'),
                    moreOptions: t('layout.moreOptions'),
                })
            }
        `
    }

    _addConsentSwitcher() {
        this.querySelector('.sibbo-panel__aside').insertAdjacentHTML('beforeend', `
            <section class="sibbo-opt-in-out">
                <div>Would you like to opt out of the sale of your personal information?</div>
                <sibbo-cmp-consent-switcher
                    tabindex="0"
                    value="${this.optInOut ? '1' : '0'}"
                >
                </sibbo-cmp-consent-switcher>
            </section>
        `)
    }

    _existingConsent() {
        const us_consent_string = Storage.getString(COOKIE_NAME);
        const optOutSale = us_consent_string.split('')[2] === 'Y' ? true : false;
        this.optInOut = optOutSale;

        if (optOutSale) {
            const confirmButton = document.querySelector('.sibbo-cmp-button');
            confirmButton.classList.remove('sibbo-cmp-button--disabled');
        }
    }

    _setEventHandlers() {
        // consent switch
        const switcher = this.querySelector('sibbo-cmp-consent-switcher');
        if (switcher) {
            switcher.addEventListener('opt-out', () => {
                this.optInOut = true;
                document.querySelector('.sibbo-cmp-button').classList.remove('sibbo-cmp-button--disabled');
            })
            switcher.addEventListener('opt-in', () => {
                this.optInOut = false;
            })
        }
    }
    
    _addEvents() {
        this.addEventListener('click', event => {
            const {target} = event;
            if (target.hasAttribute('data-accept')) {
                this._handleAccept(event);
                SibboCMP.close();
            } else if (target.hasAttribute('data-deny')) {
                this._handleDeny(event);
                SibboCMP.close();
            } else if (target.hasAttribute('data-close')) {
                event.preventDefault();
                SibboCMP.close();
            }
        })
    }

    _handleAccept(event) {
        event.preventDefault();

        // has explicit notice been provided as required by the CCPA
        const explicit = this.querySelector('sibbo-cmp-consent-switcher') ? true : false;

        setUSPData(
            1,
            explicit,
            this.optInOut,
            cmpConfiguration.isPublicherLSPA,
        )

        this.consentSubmitted = true;
    }

    _handleDeny(event) {
        event.preventDefault();

        // has explicit notice been provided as required by the CCPA
        const explicit = this.querySelector('sibbo-cmp-consent-switcher') ? true : false;
        
        setUSPData(
            1,
            explicit,
            false,
            cmpConfiguration.isPublicherLSPA,
        )

        this.consentSubmitted = true;
    }
}