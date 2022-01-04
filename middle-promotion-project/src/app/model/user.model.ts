export class UserProfile {

    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
        public name: string,
        public image: string | undefined | null,
        public age: number | undefined | null,
        public isDefaultUser: boolean) {
    }

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }

        return this._token;
    }
}

export interface UserAdditionalInfo {
    information: { name: string; age?: number | null };
    avatar?: { src: string };
    isDefaultUser: boolean;
}


export interface UserMainInfo {
    email: string;
    localId: string;
    idToken: string;
    expiresIn: number,
    displayName: string;
    photoURL?: string | null;
}
