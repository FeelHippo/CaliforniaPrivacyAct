import i18next from 'i18next';
import resources from '../locales/resources';

export default class SibboI18n {
    static init(language) {
        language = language.toLowerCase();

        i18next.init({
            lng: language,
            fallbackLng: 'es',
            resources
        })
    }

    static t(key, options={}) {
        return i18next.t(key, options);
    }
    
    static get languages() {
        return i18next.languages;
    }
}