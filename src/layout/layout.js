import "core-js/stable";
import "regenerator-runtime/runtime";
import Storage from '../storage/storage';
import UsprivacyString from '../usprivacy-string';
const API_VERSION = 1;
let uspString = new UsprivacyString();

export const addFrame = () => {
    if(!window.frames['__uspapiLocator']) {
        if(document.body) {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'display:none';
            iframe.name = '__uspapiLocator';
            document.body.appendChild(iframe);
        } else {
            setTimeout(addFrame, 5);
        }
    }
};

export const getUSPData = (apiver, callback) => {
    if (typeof callback === 'function') {
        if (
            apiver !== null &&
            apiver !== undefined &&
            apiver != API_VERSION
        ) {
            if (typeof callback === 'function')
                callback(null, false);
            return;
        }
        // retrieve data from local storage
        let consent_string = Storage.getString('usprivacy');
        if (consent_string.length) {
            if (!uspString.setUsprivacyString(consent_string)) {
                console.log('Warning: consent string not set.');
            }
        }

        // retrieve the uspstring and store it inside the uspdata object
        let us_consent_string = uspString.getUsprivacyString();
        if (us_consent_string) {
            callback(
                {
                    version: uspString.getVersion(),
                    uspString: us_consent_string
                },
                true
            )
        } else {
            callback(
                {
                    version: null,
                    uspString: null
                },
                false
            )
        }
    } else {
        console.error('__uspapi: callback parameter not a function.')
    }
};

export const addLogo = () => {
    if (!LOGO_URL) { return };

    let logo;
    let logoStorage;

    try {
        if (typeof localStorage.getItem === 'function') {
            logoStorage = localStorage.getItem('sibbo-cmp-logo');
        }
    } catch (error) {
        return;
    }

    if (logoStorage) {
        logo = `<img src="${logoStorage}" alt="logo" class="sibbo-logo" />`;
    } else {
        const xhr = new XMLHttpRequest();
        let blob;
        const fileReader = new FileReader();

        xhr.open('GET', LOGO_URL, true);
        xhr.responseType = 'arraybuffer';

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                blob = new Blob([xhr.response], {type: 'image/png'});

                fileReader.onload = evt => {
                    const result = evt.target.result;
                    try {
                        localStorage.setItem('sibbo-cmp-logo', result);
                    } catch (error) {
                        console.log(error);
                    }
                };
                fileReader.readAsDataURL(blob);
            }
        }, false);

        xhr.send();
        logo = `<img src="${LOGO_URL}" alt="logo" class="sibbo-logo" />`;
    }

    const mainText = document.querySelector('.sibbo-panel__main__text');
    const mainAside = document.querySelector('.sibbo-panel__aside');

    if (LOGO_HREF) {
        logo = `<a href="${LOGO_HREF}" target="_blank">${logo}</a>`;
    };

    mainText.insertAdjacentHTML('afterend', logo);
    mainAside.insertAdjacentHTML('beforeend', logo);
}
