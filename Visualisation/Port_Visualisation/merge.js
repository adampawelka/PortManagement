// The project ships a local UMD build of lodash at `Visualisation/lodash/lodash.js`.
// That script defines `_` on the global object. We prefer to use the global
// `_` to avoid requiring an npm package in the Frontend.
const _ = (typeof globalThis !== 'undefined' && globalThis._) || (typeof window !== 'undefined' && window._);

if (typeof _ === 'undefined') {
    throw new Error('Lodash (`_`) not found. Please ensure the Visualisation lodash script is loaded or install lodash in the Frontend.');
}

export function merge(object, ...sources) {
    // Use lodash's mergeWith to perform deep merges
    return _.mergeWith(object, ...sources, (objValue, srcValue, key, object, source) => {
        if (_.isArray(objValue)) { // Arrays must be concatenated
            return objValue.concat(srcValue);
        }
        else {
            const descriptor = Object.getOwnPropertyDescriptor(object, key);
            if (descriptor !== undefined && !descriptor.writable) { // It must be taken into account that there are properties in three.js (such as position and scale) that are read-only
                descriptor.value = srcValue;
                descriptor.writable = true; // Set the property temporarily writable
                Object.defineProperty(object, key, descriptor);
                descriptor.writable = false; // Set the property back to read-only
                Object.defineProperty(object, key, descriptor);
            }
        }
    });
}