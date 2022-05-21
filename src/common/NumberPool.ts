export default class NumberPool {
    constructor(initialValue: number|undefined = undefined) {
        if (initialValue !== undefined) {
            this.currentValue = initialValue;
        } else {
            this.currentValue = 0;
        }
    }

    currentValue: number;

    getNext(): number {
        return this.currentValue++;
    }

    reset(value: number) {
        this.currentValue = value;
    }
}
