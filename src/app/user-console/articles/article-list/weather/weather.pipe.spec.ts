import { WeatherPipe } from './weather.pipe';

describe('WeatherPipe', () => {
    it('create an instance', () => {
        const pipe = new WeatherPipe();
        expect(pipe).toBeTruthy();
    });

    it('should round temperature', () => {
        const pipe = new WeatherPipe();
        const res = pipe.transform(12.334567);

        expect(res).toBe(12);
    });
});
