export interface UpdateInformationData {
    firstName: string;
    lastName: string;
    age: number;
}

export interface UpdatePasswordData {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ChangePasswordReturnData {
    email: string;
    emailVerified: boolean;
    idToken: string;
    kind: string;
    localId: string;
    passwordHash: string;
}

export interface ReauthenticateReturnData {
    email: string;
    idToken: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered: boolean;
}
