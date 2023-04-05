import { env } from 'process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db.server';
import utils from '../../utils/passwordUtils';
import { getUserFields } from '../../utils/userUtils';
import ApiError from '../../abstractions/ApiError';
import { ICreateUserDto, ISignUpResponse, IGetUserDto } from './user.types';

export const listUsers = async (): Promise<IGetUserDto[]> =>
	db.user.findMany({
		select: getUserFields(),
	});

export const getUser = async (id: string): Promise<IGetUserDto> =>
	db.user.findUnique({
		where: {
			id,
		},
		select: getUserFields(),
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
		throw new ApiError('User Already exists', 400);
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
		throw new ApiError('No user', 400);
	}

	user = await db.user.update({
		data: { lastLogin: new Date() },
		where: {
			id: user.id,
		},
	});
	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		throw new ApiError('Invalid password', 400);
	}
	return {
		user,
		token: jwt.sign({ userId: user.id }, env.JWT_SECRET, {
			expiresIn: '2d',
		}),
	};
};

export const uploadProfilePicture = async (
	picturePath: string,
	user: IGetUserDto,
): Promise<boolean> => {
	const updatedUser = await db.user.update({
		where: {
			id: user.id,
		},
		data: {
			picturePath,
		},
	});
	if (updatedUser) return true;
	return false;
};
