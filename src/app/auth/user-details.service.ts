import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { combineLatest, map, Observable } from "rxjs";
import { UpdateInformationData } from "../model/user-edit.model";
import { UserAdditionalInfo } from "../model/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserDetailsService {

    constructor(private http: HttpClient) {}

    public saveUserDetails(uid: string, userDetails: UserAdditionalInfo): Observable<UserAdditionalInfo> {
        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`,
             userDetails);
    }

    public fetchUser(uid: string): Observable<UserAdditionalInfo> {
        return this.http.get<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}.json`,
        );
    }

    public fetchUserDetails(uid: string, isSignupMode: boolean): Observable<UserAdditionalInfo> {
        return combineLatest([this.fetchUser(uid),
            this.updateUserType(isSignupMode, uid)])
                .pipe(
                    map(([additionalInfo, updatedUserType]: [UserAdditionalInfo ,boolean]) => {
                        return {
                            ...additionalInfo,
                            isDefaultUser: updatedUserType
                        };
                    })
                );
    }

    public updateUserInfo(data: UpdateInformationData, uid: string): Observable<UserAdditionalInfo> {
        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/information.json`,
             { age: data.age, name: data.firstName + ' ' + data.lastName});
    }

    public updateAvatar(avatar: string, uid: string): Observable<UserAdditionalInfo> {
        return this.http.put<UserAdditionalInfo>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/avatar.json`,
            { src: avatar });
    }

    public updateUserType(isDefaultUser: boolean, uid: string | null): Observable<boolean> {
        return this.http.put<boolean>(
            `https://middle-promotion-project-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/isDefaultUser.json`,
            isDefaultUser);
    }
}
