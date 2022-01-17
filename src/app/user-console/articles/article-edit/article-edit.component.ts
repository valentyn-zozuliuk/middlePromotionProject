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
    public editMode: boolean = false;
    public selectedTypeFilter!: string | undefined;
    public articleForm!: FormGroup;
    public showTypeFilterMenu: boolean = false;
    private userProfile: UserProfile | null = null;
    private article: Article | null = null;
    public errors$: Observable<string[]> | null = null;
    public showLoading: boolean = false;

    public imageHandler: { imageName: string, uploadedImage: string, errorImageUpload: string } = {
        imageName: "",
        uploadedImage: "",
        errorImageUpload: ""
    };

    public articleTypeFilters: ArticleTypeFilter[] = [
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

    private preselectImage(): void {
        this.imageHandler.uploadedImage = this.article?.coverImage ?
                    this.article.coverImage : ''
    }

    private preselectType(): void {
        this.articleTypeFilters.forEach(filter => filter.code === this.article?.type && (filter.selected = true));
        this.getSelectedType();
    }

    public backToDashboard(): void {
        this.router.navigate(['/user-console/articles']);
    }

    public toggleType(e: Event): void {
        e.stopPropagation();
        this.showTypeFilterMenu = !this.showTypeFilterMenu;
    }

    public selectType(e: Event | null = null, index: number | null = null): void {
        e && e.stopPropagation();
        index !== null && this.refreshTypeFilter(index);
        this.getSelectedType();
        this.showTypeFilterMenu = false;
        this.articleForm.patchValue({
            type: this.getSelectedTypeEnum()
        });
    }

    private refreshTypeFilter(index: number): void {
        this.articleTypeFilters.forEach((typeFilter: ArticleTypeFilter) => {
            typeFilter.selected = false;
        });

        this.articleTypeFilters[index].selected = true;
    }

    private getSelectedType(): void {
        this.selectedTypeFilter = this.articleTypeFilters.find((typeFilter: ArticleTypeFilter) => {
            return typeFilter.selected;
        })?.name;
    }

    private getSelectedTypeEnum(): ArticleTypesFilter | undefined {
        return this.articleTypeFilters.find((typeFilter: ArticleTypeFilter) => {
            return typeFilter.selected;
        })?.code;
    }

    public fileBrowseHandler(e: Event): void {
        this.imageHandler.uploadedImage = "";
        this.imageHandler.imageName = "";
        this.imageHandler.errorImageUpload = "";

        if (e.target instanceof HTMLInputElement) {
            const files = e.target?.files;
            this.showPreview(files);
        }
    }

    public onFileDropped(files: FileList): void {
        this.imageHandler.uploadedImage = "";
        this.imageHandler.imageName = "";
        this.imageHandler.errorImageUpload = "";

        this.showPreview(files);
    }

    private showPreview(files: FileList | null): void {
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

    public onSubmitForm(): void {
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

            this.showLoading = true;


            this.editMode ?
                this.articlesService.updateArticle(article, this.article?.uid)
                    .pipe(
                        takeUntil(this.destroy$)
                    )
                    .subscribe({
                        next: () => this.router.navigate(['/user-console/articles']),
                        error: () => this.showLoading = false,
                        complete: () => this.showLoading = false
                    }):
                this.articlesService.addArticle(article)
                    .pipe(
                        takeUntil(this.destroy$)
                    )
                    .subscribe({
                        next: () => this.router.navigate(['/user-console/articles']),
                        error: () => this.showLoading = false,
                        complete: () => this.showLoading = false
                    });
        }
    }
}
