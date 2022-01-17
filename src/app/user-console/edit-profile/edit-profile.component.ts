import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, switchMap, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserDetailsService } from 'src/app/auth/user-details.service';
import { MessagesService } from 'src/app/global-services/messages.service';
import { UserCredentials } from 'src/app/model/credentials.model';
import { UpdateInformationData, UpdatePasswordData } from 'src/app/model/user-edit.model';
import { UserProfile } from 'src/app/model/user.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';
import { ArticlesService } from '../articles/articles.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends ClearObservable implements OnInit {
    public userEditSubmitEmitter: EventEmitter<void> = new EventEmitter<void>();

    public tabIndex: number = 0;
    public userInfo: UserProfile | null = null;
    public errors$: Observable<string[]> | null = null;
    public showLoading: boolean = false;

    constructor(
        private router: Router,
        private auth: AuthService,
        private messages: MessagesService,
        private articlesService: ArticlesService,
        private userDetailsService: UserDetailsService
    ) {
        super();
     }

    ngOnInit(): void {
        this.messages.clearMessages();
        this.errors$ = this.messages.errors$;
        this.auth.user
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((res: UserProfile | null) => {
                this.userInfo = res;
            });
    }

    public backToDashboard(): void {
        this.router.navigate(['/user-console/articles']);
    }

    public changeTab(e: MatTabChangeEvent): void {
        this.tabIndex = e.index;
    }

    public submitForm(): void {
        this.userEditSubmitEmitter.emit();
    }

    public onUpdateInformation(e: UpdateInformationData): void {
        if (this.userInfo && this.checkIfNeedToUpdateInfoOnBe(e)) {
            this.showLoading = true;
            this.messages.clearMessages();

            this.userDetailsService.updateUserInfo(e, this.userInfo.id)
                .pipe(
                    takeUntil(this.destroy$),
                    catchError((error) => {

                        this.messages.showErrors('Error updating user.');

                        return throwError(() => new Error(error));
                    }),
                    finalize(() => {
                        this.showLoading = false;
                    })
                )
                .subscribe(() => {
                    this.auth.updateUserProfile(e.firstName + ' ' + e.lastName, e.age);
                    this.userInfo && this.articlesService.updateAuthorsArticles(this.userInfo);
                    this.router.navigate(['user-console/articles']);
                });

            return;
        }

        this.router.navigate(['user-console/articles']);
    }

    private checkIfNeedToUpdateInfoOnBe(updatedInfo: UpdateInformationData): boolean {
        return !(this.userInfo?.name === updatedInfo.firstName + ' ' +updatedInfo.lastName &&
            this.userInfo.age === updatedInfo.age);
    }

    public onUpdateAvatar(e: string): void {
        if (this.userInfo) {
            this.showLoading = true;
            this.messages.clearMessages();

            this.userDetailsService.updateAvatar(e, this.userInfo.id)
                .pipe(
                    takeUntil(this.destroy$),
                    catchError((error) => {

                        this.messages.showErrors('Error updating avatar.');

                        return throwError(() => new Error(error));
                    }),
                    finalize(() => {
                        this.showLoading = false;
                    })
                )
                .subscribe(() => {
                    this.auth.updateUserProfile("", 0, e);
                    this.userInfo && this.articlesService.updateAuthorsArticles(this.userInfo);
                    this.router.navigate(['user-console/articles']);
                });
        }
    }

    public onUpdatePassword(e: UpdatePasswordData): void {
        if (this.userInfo) {
            this.showLoading = true;
            this.messages.clearMessages();

            this.auth.reauthenticateUser(e, this.userInfo.email)
                .pipe(
                    takeUntil(this.destroy$),
                    switchMap(() => {
                        if (this.userInfo?.token) {
                            return this.auth.changePassword(this.userInfo.token, e.newPassword)
                        }

                        return throwError(() => new Error('No user token. Please relogin.'));
                    }),
                    switchMap(() => {
                        if (this.userInfo?.email) {
                            const credentials: UserCredentials = {
                                email: this.userInfo?.email,
                                password: e.newPassword,
                                returnSecureToken: true
                            }
                            return this.auth.login(credentials);
                        }

                        return throwError(() => new Error('No user email. Please relogin.'));
                    }),
                    catchError((error) => {
                        if (error.error.error.message === 'INVALID_PASSWORD') {
                            this.messages.showErrors('Invalid old password.');
                        } else if (error.error.error.message === 'TOKEN_EXPIRED') {
                            this.messages.showErrors('Please relogin to have best App performance.');
                        } else {
                            this.messages.showErrors(error.error.error.message);
                        }

                        return throwError(() => new Error(error));
                    }),
                    finalize(() => {
                        this.showLoading = false;
                    })
                )
                .subscribe({
                    error: error => console.log(error)
                });
        }
    }
}
