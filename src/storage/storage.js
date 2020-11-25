export default Storage = {
    getString: itemName => {
        try {
            if (typeof localStorage.getItem === 'function') {
                const uspapiString = localStorage.getItem(itemName);
                return uspapiString || '';
            }
        } catch (error) {
            console.log(error);
        }
    },
    setString: (itemName, uspapiString) => {
        try {
            if (typeof localStorage.setItem === 'function') {
                localStorage.setItem(itemName, uspapiString);
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    }
}