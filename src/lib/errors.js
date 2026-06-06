// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: cog;
class DuplicateError extends Error {
    /**
     * @param {string} message 
     */
    constructor(message) {
        super(message);
        this.name = "DuplicateError"
    }
}

class NetworkError extends Error {
        /**
     * @param {string} message 
     */
    constructor(message) {
        super(message);
        this.name = "NetworkError"
    }
}

module.exports = { DuplicateError, NetworkError }