/** class UsprivacyString:
* contains the methods to set/get the usprivacy string and a method to get the current version
* more info on the consent string here: https://github.com/InteractiveAdvertisingBureau/USPrivacy/blob/master/CCPA/US%20Privacy%20String.md
**/

const validStringRegExp = /^[1][nNyY-][nNyY-][nNyY-]$/;

class UsprivacyString {
    constructor() {
        this.version = 1;
        this.baseString = null;
    }

    // getUsprivacyString(): returns the usprivacy string or null in case of error
    getUsprivacyString() {
        return this.baseString;
    }

    // setUsprivacyString(): check validity before value is assigned. success => true
    setUsprivacyString(newString) {
        let consentStringSet = false;
        if (validStringRegExp.test(newString)) {
            this.baseString = newString;
            consentStringSet = true;
        };
        return consentStringSet;
    }

    // getVersion(): returns version number
    getVersion() {
        return this.version;
    }
};

export default UsprivacyString;