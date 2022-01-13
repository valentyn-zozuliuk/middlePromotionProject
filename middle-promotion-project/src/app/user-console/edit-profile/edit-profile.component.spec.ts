import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MessagesService } from 'src/app/global-services/messages.service';

import { EditProfileComponent } from './edit-profile.component';

describe('EditProfileComponent', () => {
    let component: EditProfileComponent;
    let fixture: ComponentFixture<EditProfileComponent>;
    let messages: jasmine.SpyObj<MessagesService>;

    beforeEach(async () => {
        const messagesSpy = jasmine.createSpyObj('MessagesService', ['clearMessages']);

        await TestBed.configureTestingModule({
            declarations: [EditProfileComponent],
            imports: [RouterTestingModule, HttpClientModule],
            providers: [{
                provide: MessagesService,
                useValue: messagesSpy
            }]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditProfileComponent);
        component = fixture.componentInstance;
        messages = TestBed.inject(MessagesService) as jasmine.SpyObj<MessagesService>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should clear error messages and subscribe to message observable during initializtion', () => {
        messages.errors$ = of([]);
        component.ngOnInit();
        expect(messages.clearMessages).toHaveBeenCalled();
        expect(component.errors$).toBeTruthy();
    });

    it('should have the correct tab displayed upon Change Tab call', () => {
        const a = {
            index: 2
        }

        //@ts-ignore
        component.changeTab(a);
        expect(messages.clearMessages).toHaveBeenCalled();
        expect(component.tabIndex).toBe(2);
    });
});
