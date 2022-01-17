import { TestBed } from '@angular/core/testing';

import { MessagesService } from './messages.service';

describe('MessagesService', () => {
    let service: MessagesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MessagesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('error messages should be emitted correctly', () => {
        service.showErrors('error_1', 'error_2');

        service.errors$.subscribe((res) => {
            expect(res).toBeTruthy();
            expect(res.length).toBe(2);
        });
    });

    it('error messages should be cleared correctly', () => {
        service.showErrors('error_1', 'error_2');

        service.clearMessages();

        service.errors$.subscribe((res) => {
            expect(res).toBeTruthy();
            expect(res.length).toBe(0);
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
