import { Request } from 'express';
import jwt from 'jsonwebtoken';

const utils = {
	getUserId: (req: Request) => {
		const { authorization } = req.headers;
		const token = authorization.replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) throw new Error('Not auth');
		const { userId } = decoded;
		return userId;
	},
	hasLowerCase(str: string) {
		return str.toUpperCase() !== str;
	},
	hasUpperCase(str: string) {
		return str.toLowerCase() !== str;
	},
	hasNumber(string: string) {
		return /\d/.test(string);
	},

	hasSpecialChar(str: string) {
		const format = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
		if (format.test(str)) {
			return true;
		}
		return false;
	},

	isPasswordLongEnough(password: string) {
		if (password.length >= 6) {
			return true;
		}

		return false;
	},

	isPasswordSafe: (password: string) => {
		if (
			// utils.isPasswordLongEnough(password) &&
			// utils.hasSpecialChar(password) &&
			// utils.hasNumber(password) &&
			// utils.hasUpperCase(password) &&
			utils.hasLowerCase(password)
		) {
			return true;
		}
		throw new Error('Password not valid');
	},
};
export default utils;
