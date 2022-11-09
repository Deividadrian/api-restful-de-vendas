import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

// http://localhost:3333/password/forgot
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
        email: Joi.string().email().required(),
    }
  }),
  forgotPasswordController.create,
  );

  // http://localhost:3333/password/reset
passwordRouter.post(
    '/reset',
    celebrate({
      [Segments.BODY]: {
          token: Joi.string().uuid().required(),
          password: Joi.string().required(),
          password_confirmation: Joi.string().required().valid(Joi.ref('password'))
      }
    }),
    resetPasswordController.create,
    );

export default passwordRouter;
