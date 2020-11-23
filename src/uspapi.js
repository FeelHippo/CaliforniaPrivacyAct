import { addFrame, getUSPData } from './layout.js';

let pendingCalls = [];

// add the "__uspapiLocator" frame to the window
addFrame();

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

    let api = cmd => {
        try {
            return {
                getUSPData,
                __uspapi: () => {
                    return true;
                }
            } [cmd].apply(null, [].slice.call(arguments, 1));
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

window.addEventListener('message', __handleUspapiMessage, false);