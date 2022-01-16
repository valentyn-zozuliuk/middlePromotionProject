import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EditAvatarComponent } from '../user-console/edit-profile/edit-avatar/edit-avatar.component';
import { DragAndDropDirective } from './drag-and-drop.directive';

describe('DragAndDropDirective', () => {
    beforeEach(async() => {
        await TestBed.configureTestingModule({
           declarations: [DragAndDropDirective, EditAvatarComponent]
        }).compileComponents()
     });

    it('should create an instance', () => {
        const directive = new DragAndDropDirective();
        expect(directive).toBeTruthy();
    });

    it('should prevent default on dragover event', () => {
        const component = TestBed.createComponent(EditAvatarComponent);
        const input = component.debugElement.query(By.directive(DragAndDropDirective));
        const event = new Event('dragover', {
            cancelable: true
        });

        input.nativeElement.dispatchEvent(event);

        expect(input).toBeTruthy();
        expect(event.defaultPrevented).toBeTruthy();
    });

    it('should prevent default on dragleave event', () => {
        const component = TestBed.createComponent(EditAvatarComponent);
        const input = component.debugElement.query(By.directive(DragAndDropDirective));
        const event = new Event('dragleave', {
            cancelable: true
        });

        input.nativeElement.dispatchEvent(event);

        expect(input).toBeTruthy();
        expect(event.defaultPrevented).toBeTruthy();
    });

    it('should prevent default on drop event and emit correct amount of files', () => {
        const component = TestBed.createComponent(EditAvatarComponent);
        const input = component.debugElement.query(By.directive(DragAndDropDirective));

        const event = new DragEvent('drop', {
            cancelable: true
        });

        component.detectChanges();

        spyOn(component.componentInstance, 'onFileDropped');

        input.nativeElement.dispatchEvent(event);

        component.detectChanges();

        expect(input).toBeTruthy();
        expect(component.componentInstance.onFileDropped).toHaveBeenCalled();
        expect(event.defaultPrevented).toBeTruthy();

    });
});
