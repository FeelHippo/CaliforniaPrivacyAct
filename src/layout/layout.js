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
