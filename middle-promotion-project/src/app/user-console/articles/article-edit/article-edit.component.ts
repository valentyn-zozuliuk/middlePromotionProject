import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Params, Route, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import { Article, ArticleTypeFilter, ArticleTypesFilter } from 'src/app/model/article.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-article-edit',
    templateUrl: './article-edit.component.html',
    styleUrls: ['./article-edit.component.scss']
})
export class ArticleEditComponent extends ClearObservable implements OnInit {
    editMode: boolean = false;
    selectedTypeFilter!: string | undefined;
    articleForm!: FormGroup;
    showTypeFilterMenu: boolean = false;
    imageHandler: { imageName: string, uploadedImage: string, errorImageUpload: string } = {
        imageName: "",
        uploadedImage: "",
        errorImageUpload: ""
    };

    articleTypeFilters: ArticleTypeFilter[] = [
        { name: 'Business', code: ArticleTypesFilter.BUSINESS, selected: false },
        { name: 'Productivity', code: ArticleTypesFilter.PRODUCTIVITY, selected: false },
        { name: 'Media', code: ArticleTypesFilter.MEDIA, selected: false },
    ];

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private globalEventsService: GlobalEventsService
        ) {
        super();
    }

    ngOnInit(): void {
        this.route.params
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((params: Params) => {
                this.editMode = params['id'];
            });

        this.route.data
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((response) => {
                if (!response['article'] && this.editMode) {
                    this.router.navigate(['/user-console/articles']);
                }
            });

        this.globalEventsService.globalClickHandler$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.showTypeFilterMenu = false);

        this.articleForm = this.formBuilder.group({
            title: ['', Validators.required],
            text: ['', Validators.required]
        });
    }

    onSubmitForm() {
        console.log('submit');
    }

    backToDashboard() {
        this.router.navigate(['/user-console/articles']);
    }

    toggleType(e: Event) {
        e.stopPropagation();
        this.showTypeFilterMenu = !this.showTypeFilterMenu;
    }

    selectType(type: ArticleTypeFilter, e: Event | null = null, index: number | null = null) {
        e && e.stopPropagation();
        index !== null && this.refreshTypeFilter(index);
        this.getSelectedType();
        this.showTypeFilterMenu = false;
    }

    refreshTypeFilter(index: number) {
        this.articleTypeFilters.forEach((typeFilter: ArticleTypeFilter) => {
            typeFilter.selected = false;
        });

        this.articleTypeFilters[index].selected = true;
    }

    getSelectedType() {
        this.selectedTypeFilter = this.articleTypeFilters.find((typeFilter: ArticleTypeFilter) => {
            return typeFilter.selected;
        })?.name;
    }

    fileBrowseHandler(e: Event) {
        this.imageHandler.uploadedImage = "";
        this.imageHandler.imageName = "";
        this.imageHandler.errorImageUpload = "";

        if (e.target instanceof HTMLInputElement) {
            const files = e.target?.files;
            this.showPreview(files);
        }
    }

    onFileDropped(files: FileList) {
        this.imageHandler.uploadedImage = "";
        this.imageHandler.imageName = "";
        this.imageHandler.errorImageUpload = "";

        this.showPreview(files);
    }

    showPreview(files: FileList | null) {
        if (files) {
            const mimeType = files[0].type;

            if (!(mimeType === 'image/png' || mimeType === 'image/jpeg')) {
                this.imageHandler.errorImageUpload = 'Error. Wrong file format.';
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                if (reader.result && typeof reader.result === 'string') {
                    this.imageHandler.uploadedImage = reader.result;
                    this.imageHandler.imageName = files[0].name;
                }
            }
        }
    }
}
