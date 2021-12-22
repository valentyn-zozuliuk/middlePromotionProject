import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-edit-avatar',
    templateUrl: './edit-avatar.component.html',
    styleUrls: ['./edit-avatar.component.scss']
})

export class EditAvatarComponent extends ClearObservable implements OnInit {
    @Input() avatarUpdateEmitter!: EventEmitter<void>;
    @Output() avatarUpdate = new EventEmitter<string>();

    uploadedImage: string = "";
    iamgeName: string = "";
    errorImageUpload: string = "";


    constructor() {
        super();
     }

    ngOnInit(): void {
        this.avatarUpdateEmitter
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe(() => {
            this.uploadedImage ?
                this.avatarUpdate.emit(this.uploadedImage)
            : this.errorImageUpload = 'Select image for upload';
        })
    }

    fileBrowseHandler(e: Event) {
        this.uploadedImage = "";
        this.iamgeName = "";
        this.errorImageUpload = "";

        if (e.target instanceof HTMLInputElement) {
            const files = e.target?.files;
            this.showPreview(files);
        }
    }

    onFileDropped(files: FileList) {
        this.uploadedImage = "";
        this.iamgeName = "";
        this.errorImageUpload = "";

        this.showPreview(files);
    }

    showPreview(files: FileList | null) {
        if (files) {
            const mimeType = files[0].type;

            if (!(mimeType === 'image/png' || mimeType === 'image/jpeg')) {
                this.errorImageUpload = 'Error. Wrong file format.';
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                if (reader.result && typeof reader.result === 'string') {
                    this.uploadedImage = reader.result;
                    this.iamgeName = files[0].name;
                }
            }
        }
    }
}

