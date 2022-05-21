import {clamp} from "./Utils";


describe('clamp', () => {
    test('min', () => {
        expect(clamp(0, 0, 10)).toEqual(0);
        expect(clamp(-1, 0, 10)).toEqual(0);
        expect(clamp(-10, 0, 10)).toEqual(0);
        expect(clamp(-10, -1, 10)).toEqual(-1);
        expect(clamp(-10, -10, 10)).toEqual(-10);
    });
    test('max', () => {
        expect(clamp(10, 0, 10)).toEqual(10);
        expect(clamp(11, 0, 10)).toEqual(10);
        expect(clamp(10, -1, 10)).toEqual(10);
        expect(clamp(10, -10, 10)).toEqual(10);
        expect(clamp(11, -10, 10)).toEqual(10);
    });
    test('between', () => {
        expect(clamp(0, 3, 10)).toEqual(3);
        expect(clamp(1, 3, 10)).toEqual(3);
        expect(clamp(-10, 0, 10)).toEqual(0);
        expect(clamp(-10, 5, 10)).toEqual(5);
    });
})
