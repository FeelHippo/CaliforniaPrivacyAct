import SibboCMPLayout from './index';
import SibboConsentSwitcher from './consent-switcher/index';

export default () => {
    
    const register = () => {
        customElements.define('sibbo-cmp-layout', SibboCMPLayout);
        customElements.define('sibbo-cmp-consent-switcher', SibboConsentSwitcher);
    };
    window.WebComponents ? window.WebComponents.waitFor(register) : register();
}