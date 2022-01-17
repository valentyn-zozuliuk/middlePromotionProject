import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { GlobalEventsService } from './global-services/global-events.service';

describe('AppComponent', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let eventsService: jasmine.SpyObj<GlobalEventsService>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['autoLogin']);
        const eventsServiceSpy = jasmine.createSpyObj('GlobalEventsService', ['catchClick']);

        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceSpy
                },
                {
                    provide: GlobalEventsService,
                    useValue: eventsServiceSpy
                }
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'middle-promotion-project'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('middle-promotion-project');
    });

    it(`should call the 'autoLogin' during initializtion`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        app.ngOnInit();

        expect(authService.autoLogin).toHaveBeenCalled();
    });

    it(`should catch the click event and call 'GlobalEventService'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        eventsService = TestBed.inject(GlobalEventsService) as jasmine.SpyObj<GlobalEventsService>;

        app.ngOnInit();
        document.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(eventsService.catchClick).toHaveBeenCalled();
    });
});
