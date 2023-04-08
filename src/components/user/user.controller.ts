import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middleware/auth';
import { AuthRequest } from '../../middleware/interfaces/auth-types';
import { uploadProfilePicture } from '../../middleware/upload';
import {
	validateLogin,
	validateSignUp,
} from '../../validators/user-validations';
import BaseApi from '../BaseApi';
import * as UserService from './user.service';
import { ICreateUserDto } from './user.types';

export default class UserController extends BaseApi {
	public register(): Router {
		this.router.get('/', this.getUserList.bind(this));
		this.router.get('/me', auth, this.getSignedInUser.bind(this));
		this.router.get('/:id', auth, this.getUser.bind(this));
		this.router.post('/signup', this.signUpUser.bind(this));
		this.router.post('/login', this.loginUser.bind(this));
		this.router.post(
			'/avatar',
			auth,
			uploadProfilePicture(1000000).single('avatar'),
			this.uploadProfilePicture.bind(this),
		);
		return this.router;
	}

	/* eslint-disable consistent-return */
	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getUserList(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const users = await UserService.listUsers();
			res.locals.data = users;
			// call base class method
			super.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getUser(
		req: AuthRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const user = await UserService.getUser(req.params.id);
			if (user) {
				res.locals.data = user;
				return super.send(res);
			}
			super.send(res, 404);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getSignedInUser(
		req: AuthRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			if (req.user) {
				res.locals.data = req.user;
				return super.send(res);
			}
			super.send(res, 404);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	public async signUpUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { error, value } = validateSignUp(req.body);
			if (error) {
				res.locals.data = error.details;
				return super.send(res, 400);
			}
			const user = await UserService.signUpUser(
				req.body as ICreateUserDto,
			);
			if (user) {
				res.locals.data = user;
				// call base class method
				return super.send(res, 201);
			}
			super.send(res, 400);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	public async loginUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { error, value } = validateLogin(req.body);
			if (error) {
				res.locals.data = error.details;
				return super.send(res, 400);
			}
			const user = await UserService.loginUser(
				req.body.email,
				req.body.password,
			);
			if (user) {
				res.locals.data = user;
				// call base class method
				return super.send(res);
			}
			super.send(res, 400);
		} catch (err) {
			next(err);
		}
	}

	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	public async uploadProfilePicture(
		req: AuthRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const response = await UserService.uploadProfilePicture(
				req.file.path,
				req.user,
			);
			if (response) {
				return super.send(res, 200);
			}
			super.send(res, 400);
		} catch (err) {
			next(err);
		}
	}
}
/* eslint-enable consistent-return */
