import { Request } from 'express';
import { IGetUserDto } from '../../components/user/user.types';

interface AuthRequest extends Request {
	token?: string;
	user?: IGetUserDto;
}

export { AuthRequest };
