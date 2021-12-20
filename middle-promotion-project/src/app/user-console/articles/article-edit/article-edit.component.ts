import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-article-edit',
    templateUrl: './article-edit.component.html',
    styleUrls: ['./article-edit.component.scss']
})
export class ArticleEditComponent extends ClearObservable implements OnInit {
    editMode: boolean = false;
    articleForm!: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router
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

        this.articleForm = this.formBuilder.group({
            title: ['', Validators.required],
            text: ['', Validators.required]
        })
    }

    onSubmitForm() {
        console.log('submit');
    }

    backToDashboard() {
        this.router.navigate(['/user-console/articles']);
    }

    fileBrowseHandler(e: Event) {

    }

}
