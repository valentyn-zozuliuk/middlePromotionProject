export interface UserCredentials {
    email: string;
    password: string;
    returnSecureToken: boolean;
}

export interface UserAuthCredentials {
    email: string;
    password: string;
    returnSecureToken: boolean;
    name: string;
    age: number;
}
