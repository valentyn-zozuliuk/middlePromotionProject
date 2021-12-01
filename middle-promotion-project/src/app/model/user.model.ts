export class UserProfile {

    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
        public name: string,
        public image: string | undefined,
        public age: number | undefined | null) {
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
    avatar?: string;
}


export interface UserMainInfo {
    email: string;
    localId: string;
    idToken: string;
    expiresIn: number,
    displayName: string;
    photoURL?: string;
}
