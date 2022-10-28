import authConfig from '@config/auth';
import AppError from '../../shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';


export default function isAutenticated( // Um middleware recebe pelo menos tres parametro request, response e o next
    request: Request,
    response: Response,
    next: NextFunction,
    ): void {
        const authHeder = request.headers.authorization;

        if(!authHeder){
            throw new AppError('JWT Token is missing.')
        }

        const [,token] = authHeder.split(' ');

        try {
            const decodeToken = verify(token, authConfig.jwt.secret)

            return next();
        } catch {
            throw new AppError('Invalid JWT Token.')
        }
    }
