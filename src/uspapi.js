import 'regenerator-runtime/runtime';
import '@webcomponents/custom-elements';
import '@webcomponents/template';
import './services/custom-event';
import { addFrame, getUSPData } from './layout/layout.js';
import SibboCMP from './services/sibbo-cmp';
import loadComponents from './layout/component/load';
import cmpConfiguration from '../cmp-configuration';

let pendingCalls = [];

/**
 * U.S. Privacy API implementation
 */

window.__uspapi = new function (win) {
    if (win.__uspapi) {
        try {
            // if api loaded, use it
            if (win.__uspapi('__uspapi')) {
                return win.__uspapi;
            } else {
            // making a call to __uspapi  with no arguments will return the pending calls
            pendingCalls = win.__uspapi() || [];
            }
        } catch (error) {
            return win.__uspapi;
        }
    }

    let api = (cmd, version, callback) => {
        try {
            switch (cmd) {
                case 'getUSPData':
                    getUSPData(version, callback);
                    break;
            
                default:
                    break;
            };
        } catch (error) {
            console.error('__uspapi: Invalid Command: ', cmd)
        }
    }

    return api;
} (window);

// register postMessage handler
const __handleUspapiMessage = event => {
    const data = event && event.data && event.data.__uspapiCall;
    if (data) {
        window.__uspapi(data.command, data.version, (returnValue, success) => {
            event.source.postMessage({
                __uspapiReturn: {
                    returnValue,
                    success,
                    callId: data.callId
                }
            }, '*');
        })
    }
}
/**
 * react to a call to window.postMessage()
 */
window.addEventListener('message', __handleUspapiMessage, false);
/**
 * Data Deletion Request Handling
 */
window.onload = () => {
    cmpConfiguration.vendorDeleteScriptSources.forEach((vendorDeleteScriptSource) => {
        const scriptElement = document.createElement('script');
        scriptElement.src = vendorDeleteScriptSource;
    
        document.body.appendChild(scriptElement);
    });
    
    function onCCPADelete() {
        window.__uspapi('performDeletion', 1);
    }
    
    const ccpaDeleteButton = document.getElementsByClassName('ccpa-delete')[0];
    ccpaDeleteButton.addEventListener('click', onCCPADelete);
}
/**
 * add the "__uspapiLocator" frame to the window
 */
addFrame();
loadComponents();
// delete this line in prodiction:
SibboCMP.init(cmpConfiguration);

window.SibboCMP = SibboCMP;