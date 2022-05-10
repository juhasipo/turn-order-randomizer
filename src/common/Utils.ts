export const shuffle = (array: Array<number>): Array<number> => {
    const shuffled = Array.from(array);
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
};

export const isValueObject = (value: any): boolean => {
    return value !== null && typeof value === 'object';
};

export const toMap = (obj: any): Map<any, any> => {
    console.log("Convert object", obj, "to map");
    const m = new Map();
    for (let objKey in obj) {
        const value = obj[objKey];
        const parsedKey = parseInt(objKey);
        const key = Number.isInteger(parsedKey) ? parsedKey : objKey;

        console.log("Key:",
            key, typeof key,
            objKey, typeof objKey
        );

        if (isValueObject(value)) {
            console.log("Convert value to map", key, value);
            m.set(key, value);
        } else if (Array.isArray(value)) {
            console.log("Convert value to array", key, value);
            m.set(key, Array.from(value));
        } else {
            console.log("Assign value", key, value);
            m.set(key, value);
        }
    }
    return m;
};

export const toObject = (map: Map<any, any>): any => {
    return Object.fromEntries(Array.from(map.entries(), ([k, v]) => {
        if (v instanceof Array) {
            return [k, v.map(toObject)];
        } else if (v instanceof Map) {
            return [k, toObject(v)];
        } else {
            return [k, v];
        }
    }));
};



export const generateLink = (fragment: string) => {
    const href = window.location.href;
    return href.substring(0, href.indexOf("#")) + "#" + fragment;
};
