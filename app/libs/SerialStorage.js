
export default class SerialStorage
{
    constructor(storage, serializer = JSON)
    {
        this.storage = storage;
        this.serializer = serializer;
    }

    read(key)
    {
        if (arguments.length === 0) {
            const read = {};
            for (let field in this.storage) {
                read[field] = this.serializer.parse(this.storage[field]);
            }
            return read;
        } else {
            return this.serializer.parse(this.storage[key]);
        }
    }

    write(key, data)
    {
        if (arguments.length === 1) {
            for (let field in key) {
                this.storage[field] = this.serializer.stringify(key[field]);
            }
        } else {
            this.storage[key] = this.serializer.stringify(data);
        }
    }
};
