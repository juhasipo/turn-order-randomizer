export default class NumberPool {
    currentValue: number = 0;

    getNext(): number {
        return this.currentValue++;
    }

    reset(value: number) {
        this.currentValue = value;
    }
}
