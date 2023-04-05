import fs from 'fs';
import path from 'path';
import multer from 'multer';

const supportedFileExtensions = ['jpg', 'jpeg', 'png'];
/* eslint-disable consistent-return */
function uploadProfilePicture(fileSizeLimit: number): multer.Multer {
	return multer({
		storage: multer.diskStorage({
			destination(req: Express.Request, file: Express.Multer.File, cb) {
				const destPath = 'uploads/profile-pictures';
				if (!fs.existsSync(destPath)) {
					fs.mkdir(destPath, { recursive: true }, (error) => {
						if (error) {
							return cb(error, undefined);
						}
						cb(undefined, destPath);
					});
				} else {
					cb(undefined, destPath);
				}
			},
			filename(req: Express.Request, file: Express.Multer.File, cb) {
				try {
					const extName = path.extname(file.originalname);
					const fileName = `${Date.now()}${extName}`;
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
			req: Express.Request,
			file: Express.Multer.File,
			cb: multer.FileFilterCallback,
		) {
			try {
				const fileExtension = path
					.extname(file.originalname)
					.toLowerCase()
					.replace('.', '');
				if (!supportedFileExtensions.includes(fileExtension)) {
					throw new Error(
						`Unsupported file type. Please upload an image file with one of the following extensions: ${supportedFileExtensions.join(
							', ',
						)}.`,
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
