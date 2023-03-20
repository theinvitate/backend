import { env } from 'process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db.server';
import utils from '../../utils';
import { ICreateUserDto, ISignUpResponse, IGetUserDto } from './user.types';

export const listUsers = async (): Promise<IGetUserDto[]> =>
	db.user.findMany({
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			phoneNSN: true,
			phoneNumber: true,
			createdAt: true,
		},
	});

export const getUser = async (id: string): Promise<IGetUserDto> =>
	db.user.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			phoneNSN: true,
			phoneNumber: true,
			createdAt: true,
		},
	});

export const signUpUser = async (
	user: ICreateUserDto,
): Promise<ISignUpResponse> => {
	const userTest = await db.user.findUnique({
		where: {
			email: user.email,
		},
	});
	if (userTest) {
		throw new Error('User Already exists');
	}
	utils.isPasswordSafe(user.password);
	const password = await bcrypt.hash(user.password, 8);

	const validateEmailToken = await bcrypt.hash(user.email, 8);
	console.log(user);

	const createdUser = await db.user.create({
		data: {
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNSN: user.phoneNSN,
			phoneNumber: user.phoneNumber,
			email: user.email,
			password,
			resetPasswordToken: '',
			validateEmailToken,
			isEmailValidated: false,
			lastLogin: new Date(),
		},
	});

	return {
		user: createdUser,
		token: jwt.sign({ userId: createdUser.id }, env.JWT_SECRET, {
			expiresIn: '2d',
		}),
	};
};

export const loginUser = async (
	email: string,
	password: string,
): Promise<ISignUpResponse> => {
	let user = await db.user.findFirst({
		where: {
			email,
		},
	});
	if (!user) {
		throw new Error('No user');
	}

	user = await db.user.update({
		data: { lastLogin: new Date() },
		where: {
			id: user.id,
		},
	});
	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		throw new Error('Invalid password');
	}
	return {
		user,
		token: jwt.sign({ userId: user.id }, env.JWT_SECRET, {
			expiresIn: '2d',
		}),
	};
};
