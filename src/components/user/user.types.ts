import { User } from "@prisma/client";

export interface IGetUserDto {
	id: string;
	firstName: string;
	lastName: string;
	phoneNSN: string;
	phoneNumber: string;
	email: string;
	createdAt: Date;
}

export interface ICreateUserDto {
	firstName: string;
	lastName: string;
	phoneNSN: string;
	phoneNumber: string;
	email: string;
	password: string;
}

export interface ISignUpResponse {
	user: User;
	token: string;
}
