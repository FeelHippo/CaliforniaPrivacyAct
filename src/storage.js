export default Storage = {
    getString: itemName => {
        const uspapiString = localStorage.getItem(itemName);
        return uspapiString || '';
    },
    setString: (itemName, uspapiString) => {
        localStorage.setItem(itemName, uspapiString);
        return true;
    }
}