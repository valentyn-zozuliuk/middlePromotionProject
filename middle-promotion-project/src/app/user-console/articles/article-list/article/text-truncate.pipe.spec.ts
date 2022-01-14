import { TextTruncatePipe } from './text-truncate.pipe';

describe('TextTruncatePipe', () => {
    it('create an instance', () => {
        const pipe = new TextTruncatePipe();
        expect(pipe).toBeTruthy();
    });

    it('should cut more than 100 characters by default', () => {
        const string = '12345678901234567890' + '12345678901234567890' +
        '12345678901234567890' + '12345678901234567890' + '12345678901234567890' +
        '12345';
        const pipe = new TextTruncatePipe();
        const res = pipe.transform(string);

        expect(string.length).toBe(105);
        expect(res).toBe(string.substring(0, 100) + '...');
    });

    it('should cut specified amount of characters', () => {
        const string = '12345678901234567890' + '12345678901234567890' +
        '12345678901234567890' + '12345678901234567890' + '12345678901234567890' +
        '12345';
        const pipe = new TextTruncatePipe();
        const res = pipe.transform(string, 20);

        expect(string.length).toBe(105);
        expect(res).toBe(string.substring(0, 20) + '...');
    });
});
