import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { GlobalEventsService } from 'src/app/global-services/global-events.service';
import { MessagesService } from 'src/app/global-services/messages.service';
import { Article, ArticleTypeFilter, ArticleTypesFilter } from 'src/app/model/article.model';
import { UserProfile } from 'src/app/model/user.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { ArticlesService } from '../articles.service';

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
    userProfile: UserProfile | null = null;
    article: Article | null = null;
    errors$: Observable<string[]> | null = null;

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
        private globalEventsService: GlobalEventsService,
        private articlesService: ArticlesService,
        private auth: AuthService,
        private messages: MessagesService
        ) {
        super();
    }

    ngOnInit(): void {
        this.messages.clearMessages();
        this.errors$ = this.messages.errors$;

        this.articleForm = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            type: ['', Validators.required],
            image: ['', Validators.required]
        });

        this.auth.user
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(user => this.userProfile = user);

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

                this.article = response['article'];

                this.editMode && this.articleForm.patchValue({
                    title: this.article?.title,
                    description: this.article?.description,
                    type: this.article?.type,
                    image: this.article?.coverImage
                });

                this.editMode && this.preselectImage();
                this.editMode && this.preselectType();
            });

        this.globalEventsService.globalClickHandler$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.showTypeFilterMenu = false);
    }

    preselectImage() {
        this.imageHandler.uploadedImage = this.article?.coverImage ?
                    this.article.coverImage : ''
    }

    preselectType() {
        this.articleTypeFilters.forEach(filter => filter.code === this.article?.type && (filter.selected = true));
        this.getSelectedType();
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
        this.articleForm.patchValue({
            type: this.getSelectedTypeEnum()
        });
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

    getSelectedTypeEnum() {
        return this.articleTypeFilters.find((typeFilter: ArticleTypeFilter) => {
            return typeFilter.selected;
        })?.code;
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

                    this.articleForm.patchValue({
                        image: this.imageHandler.uploadedImage
                    });
                }
            }
        }
    }

    onSubmitForm() {
        this.imageHandler.errorImageUpload = "";

        if (!this.imageHandler.uploadedImage) {
            this.imageHandler.errorImageUpload = 'Select new image for upload';
        }

        if (this.articleForm.valid) {
            const article: Article = {
                title: this.articleForm.controls['title'].value,
                description: this.articleForm.controls['description'].value,
                type: this.articleForm.controls['type'].value,
                coverImage: this.articleForm.controls['image'].value,
                updatedDate: new Date().getTime(),
                createdBy: {
                    image: this.userProfile?.image ? this.userProfile.image : '',
                    name: this.userProfile?.name ? this.userProfile.name : '',
                    uid: this.userProfile?.id ? this.userProfile.id : ''
                }
            };

            this.editMode ?
                this.articlesService.updateArticle(article, this.article?.uid)
                    .subscribe(
                        () => this.router.navigate(['/user-console/articles'])
                    ) :
                this.articlesService.addArticle(article)
                    .subscribe(
                        () => this.router.navigate(['/user-console/articles'])
                    );
        }
    }
}
