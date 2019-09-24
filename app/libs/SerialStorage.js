
export default class SerialStorage
{
    constructor(storage, errorHandler)
    {
        this.storage = storage;
        this.errorHandler = errorHandler;
    }

    read(key)
    {
        if (arguments.length === 0) {
            const read = {};
            for (let field in this.storage) {
                read[field] = this.read(field);
            }
            return read;
        } else {
            return this.parse('read', key, this.storage[key]);
        }
    }

    write(key, data)
    {
        if (arguments.length === 1) {
            for (let field in key) {
                this.write(field, key[field]);
            }
        } else {
            this.storage[key] = this.stringify('write', key, data);
        }
    }

    stringify(method, key, value)
    {
        try {
            return JSON.stringify(value);
        } catch (error) {
            if (this.errorHandler) {
                return this.errorHandler(method, error, key, value);
            } else {
                throw e;
            }
        }
    }

    parse(method, key, value)
    {
        try {
            return JSON.parse(value);
        } catch (error) {
            if (this.errorHandler) {
                return this.errorHandler(method, error, key, value);
            } else {
                throw e;
            }
        }
    }
};
