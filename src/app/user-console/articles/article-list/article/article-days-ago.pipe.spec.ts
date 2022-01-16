import { ArticleDaysAgoPipe } from './article-days-ago.pipe';

describe('ArticleDaysAgoPipe', () => {
    it('create an instance', () => {
        const pipe = new ArticleDaysAgoPipe();
        expect(pipe).toBeTruthy();
    });

    it('should apply `days ago` if more than 2 days ago', () => {
        const pipe = new ArticleDaysAgoPipe();
        const date = new Date();
        date.setDate(date.getDate() - 22);

        const dateInPast = date.getTime();

        const res = pipe.transform(dateInPast);

        expect(res).toMatch('22 days ago');
    });

    it('should apply `day ago` if 1 day ago', () => {
        const pipe = new ArticleDaysAgoPipe();
        const date = new Date();
        date.setDate(date.getDate() - 1);

        const dateInPast = date.getTime();

        const res = pipe.transform(dateInPast);

        expect(res).toBe('1 day ago');
    });

    it('should apply `today` if 1 day ago', () => {
        const pipe = new ArticleDaysAgoPipe();
        const date = new Date();
        const dateInPast = date.getTime();

        const res = pipe.transform(dateInPast);

        expect(res).toBe('today');
    });
});
