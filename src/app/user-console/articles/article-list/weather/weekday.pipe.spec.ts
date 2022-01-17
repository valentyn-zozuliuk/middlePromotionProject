import { WeekdayPipe } from './weekday.pipe';

describe('WeekdayPipe', () => {
    it('create an instance', () => {
        const pipe = new WeekdayPipe();
        expect(pipe).toBeTruthy();
    });

    it('should transform week days correctly (0 - 6 starting form Sunday)', () => {
        const pipe = new WeekdayPipe();
        const res = pipe.transform(1);

        expect(res).toBe('Monday');
    });
});
