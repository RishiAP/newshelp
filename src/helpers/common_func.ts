import { NextRequest } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { parse } from 'cookie';

export async function getAuthorFromHeader(req: NextRequest): Promise<JwtPayload | null> {
    const cookies = parse(req.headers.get('cookie') || '');
    if (cookies.jwtAccessToken && cookies.jwtAccessToken.length > 0) {
        try {
            const secret = process.env.JWT_SECRET || '';
            return jwt.verify(cookies.jwtAccessToken, secret) as JwtPayload;
        } catch (err) {
            console.error('JWT verification failed:', err);
        }
    }
    return null;
}