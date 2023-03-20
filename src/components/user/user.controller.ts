import { NextFunction, Request, Response, Router } from 'express';
import BaseApi from '../BaseApi';
import * as UserService from './user.service';

export default class UserController extends BaseApi {
	public register(): Router {
		this.router.get('/', this.getUserList.bind(this));
		this.router.get('/:id', this.getUser.bind(this));
		this.router.post('/signup', this.signUpUser.bind(this));
		this.router.post('/login', this.loginUser.bind(this));
		return this.router;
	}

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

	/* eslint-disable consistent-return */
	/**
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const user = await UserService.getUser(req.params.id);
			if (user) {
				res.locals.data = user;
				// call base class method
				return super.send(res);
			}
			return super.send(res, 404);
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
			const user = await UserService.signUpUser(req.body);
			if (user) {
				res.locals.data = user;
				// call base class method
				return super.send(res);
			}
			return super.send(res, 400);
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
			const user = await UserService.loginUser(
				req.body.email,
				req.body.password,
			);
			if (user) {
				res.locals.data = user;
				// call base class method
				return super.send(res);
			}
			return super.send(res, 400);
		} catch (err) {
			next(err);
		}
	}
	/* eslint-enable consistent-return */
}
