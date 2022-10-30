import authConfig from '@config/auth';
import AppError from '../../errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function isAutenticated( // Um middleware recebe pelo menos tres parametro request, response e o next
    request: Request,
    response: Response,
    next: NextFunction,
    ): void {
        const authHeader = request.headers.authorization;

        if(!authHeader){
            throw new AppError('JWT Token is missing.')
        }

        const [,token] = authHeader.split(' ');

        try {
            const decodedToken = verify(token, authConfig.jwt.secret)

            console.log(decodedToken);

            const { sub } = decodedToken as ITokenPayload;

            request.user = {
                id: sub,
            }

            return next();
        } catch {
            throw new AppError('Invalid JWT Token.')
        }
    }
