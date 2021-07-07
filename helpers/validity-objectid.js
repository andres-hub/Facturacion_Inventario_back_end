
const validyty = async(id) => {

    const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    const valid =  await checkForHexRegExp.test(id);

    return valid;

}

module.exports = {
    validyty
}