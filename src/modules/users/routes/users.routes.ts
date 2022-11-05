import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import isAutenticated from '@shared/http/middlewares/isAutenticated';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.get('/', isAutenticated, usersController.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }
  }),
  usersController.create);


usersRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  usersController.delete);

  usersRouter.put(
    '/:id',
    celebrate({
      [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      [Segments.PARAMS]: {
        id: Joi.string().uuid().required()
      }
    }),
    usersController.update
  );

  usersRouter.get(
    '/:id',
    celebrate({
      [Segments.PARAMS]: {
        id: Joi.string().uuid().required()
      }
    }),
    usersController.show
  );

  usersRouter.patch(
    '/avatar',
    isAutenticated,
    upload.single('avatar'),
    usersAvatarController.update,
  )

export default usersRouter
