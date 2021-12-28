import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs';
import { UserProfile } from 'src/app/model/user.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-edit-avatar',
    templateUrl: './edit-avatar.component.html',
    styleUrls: ['./edit-avatar.component.scss']
})

export class EditAvatarComponent extends ClearObservable implements OnInit, OnChanges {
    @Input() avatarUpdateEmitter!: EventEmitter<void>;
    @Input() userInfo!: UserProfile | null;
    @Output() avatarUpdate = new EventEmitter<string>();

    uploadedImage: string = "";
    iamgeName: string = "";
    errorImageUpload: string = "";


    constructor() {
        super();
    }

    ngOnChanges(): void {
        if (this.userInfo?.image) {
            this.uploadedImage = this.userInfo.image;
        }
    }

    ngOnInit(): void {
        this.avatarUpdateEmitter
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe(() => {
            this.uploadedImage && this.iamgeName ?
                this.avatarUpdate.emit(this.uploadedImage)
            : this.errorImageUpload = 'Select new image for upload';
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

