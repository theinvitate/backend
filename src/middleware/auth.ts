import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUserDto } from '../components/user/user.types';
import { db } from '../db.server';
import { AuthRequest } from './interfaces/auth-types';

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await db.user.findUnique({
			where: {
				id: decoded.userId,
			},
			select: {
				id: true,
				firstName: true,
				lastName: true,
				phoneNSN: true,
				phoneNumber: true,
				email: true,
				createdAt: true,
			},
		});

		if (!user) throw new Error('User not found');

		req.token = token;
		req.user = user as IGetUserDto;
		next();
	} catch (e) {
		res.status(401).send({ error: 'Please authenticate' });
	}
};

export default auth;
