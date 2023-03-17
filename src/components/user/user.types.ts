export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	phoneNSN: string;
	phoneNumber: string;
	email: string;
	password: string;
	createdAt: Date;
}

export interface ISignUpResponse {
	user: IUser;
	token: string;
}
