import fs from 'fs';
import path from 'path';
import multer from 'multer';
import ApiError from '../abstractions/ApiError';
import { AuthRequest } from './interfaces/auth-types';

const supportedFileExtensions = ['jpg', 'jpeg', 'png'];
/* eslint-disable consistent-return */
function uploadProfilePicture(fileSizeLimit: number): multer.Multer {
	return multer({
		storage: multer.diskStorage({
			destination(req: AuthRequest, file: Express.Multer.File, cb) {
				const destPath = 'uploads/profile-pictures';
				if (!fs.existsSync(destPath)) {
					fs.mkdir(destPath, { recursive: true }, (error) => {
						if (error) {
							return cb(
								new ApiError(
									'Something happened while creating directory',
									400,
								),
								undefined,
							);
						}
						cb(undefined, destPath);
					});
				} else {
					cb(undefined, destPath);
				}
			},
			filename(req: AuthRequest, file: Express.Multer.File, cb) {
				try {
					const extName = path.extname(file.originalname);
					const fileName = `${Date.now()}${req.user.id}${extName}`;
					cb(null, fileName);
				} catch (error) {
					cb(error, undefined);
				}
			},
		}),
		limits: {
			fileSize: fileSizeLimit,
		},
		fileFilter(
			req: AuthRequest,
			file: Express.Multer.File,
			cb: multer.FileFilterCallback,
		) {
			try {
				const fileExtension = path
					.extname(file.originalname)
					.toLowerCase()
					.replace('.', '');
				if (!supportedFileExtensions.includes(fileExtension)) {
					throw new ApiError(
						`Unsupported file type. Please upload an image file with one of the following extensions: ${supportedFileExtensions.join(
							', ',
						)}.`,
						400,
					);
				}
				const fileSize = parseInt(req.headers['content-length'], 10);
				if (fileSize > fileSizeLimit) {
					throw new ApiError(
						`Max size of profile picture is ${fileSizeLimit}`,
						400,
					);
				}
				cb(undefined, true);
			} catch (error) {
				cb(error, false);
			}
		},
	});
}
/* eslint-enable consistent-return */
export { uploadProfilePicture };
