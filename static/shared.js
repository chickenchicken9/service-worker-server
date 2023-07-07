function tryEval(src) {
    try {
        const value = eval?.(src);
        return value;
    } catch (error) {
        return undefined;
    }
}

/**
 * Returns: {
 *   globals: {things defined in global scope}
 *   value: return value
 *   errors: [any errors encountered - missing props, etc.]
 * }
 */
function run(src) {
    const errors = [];
    const globals = { [Symbol.unscopables]: {} };
    const proxyGlobal = new Proxy(globals, {
        has(_, key) { return true;},
        set(obj, prop, value) {
            console.log(`proxyGlobal.set(${prop})`);
            globals[prop] = value;
        },
        get(_, prop) {
            console.log(`proxyGlobal.get(${prop.toString()})`);
            if (prop in globals) return globals[prop];
            const global = tryEval(prop.toString());
            if (global) return global;

            errors.push(`Global prop not found: ${prop.toString()}`);
        }
    });

    try {
        const value = eval(`with(proxyGlobal) { ${src} }`);
        return {
            globals,
            value,
            errors
        };
    } catch (err) {
        errors.push(`Error: ${err}\nStack: ${err.stack}`);
        return {errors};
    }
}