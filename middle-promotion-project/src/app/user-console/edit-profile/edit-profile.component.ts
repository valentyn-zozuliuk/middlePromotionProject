import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, switchMap, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MessagesService } from 'src/app/global-services/messages.service';
import { UserCredentials } from 'src/app/model/credentials.model';
import { UpdateInformationData, UpdatePasswordData } from 'src/app/model/user-edit.model';
import { UserProfile } from 'src/app/model/user.model';
import { ClearObservable } from 'src/app/shared/clear-observable/clear-observable';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends ClearObservable implements OnInit {
    userEditSubmitEmitter: EventEmitter<void> = new EventEmitter<void>();

    tabIndex: number = 0;
    userInfo: UserProfile | null = null;
    errors$: Observable<string[]> | null = null;
    showLoading: boolean = false;

    constructor(
        private router: Router,
        private auth: AuthService,
        private messages: MessagesService,
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

    backToDashboard() {
        this.router.navigate(['/user-console/articles']);
    }

    changeTab(e: MatTabChangeEvent) {
        this.tabIndex = e.index;
    }

    submitForm() {
        this.userEditSubmitEmitter.emit();
    }

    onUpdateInformation(e: UpdateInformationData) {
        if (this.userInfo) {
            this.showLoading = true;
            this.messages.clearMessages();

            this.auth.updateUserInfo(e, this.userInfo.id)
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
                    this.router.navigate(['user-console/articles']);
                });
        }
    }


    onUpdateAvatar(e: string) {
        if (this.userInfo) {
            this.showLoading = true;
            this.messages.clearMessages();

            this.auth.updateAvatar(e, this.userInfo.id)
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
                    this.router.navigate(['user-console/articles']);
                });
        }
    }

    onUpdatePassword(e: UpdatePasswordData) {
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
                .subscribe();
        }
    }
}
