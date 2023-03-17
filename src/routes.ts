import { Router } from 'express';
import SystemStatusController from './components/system-status/system-status.controller';
import UserController from './components/user/user.controller';

/**
 * Here, you can register routes by instantiating the controller.
 *
 */
export default function registerRoutes(): Router {
	const router = Router();

	// System Status Controller
	const systemStatusController: SystemStatusController =
		new SystemStatusController();
	router.use('/api/status', systemStatusController.register());

	router.use('/api/users', new UserController().register());

	return router;
}
