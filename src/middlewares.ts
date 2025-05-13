import { decodeToken, verifyToken } from "./utils/encryption";

export const checkLogin = async (c: any, next: any) => {
    let authorized = false;
    let token = c.req.header('Authorization') || c.req.query('token');
    if (token?.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    
    if (token) {
        try {
            const verify = await verifyToken(token);

            if (verify) {
            
                const payload = decodeToken(token);
                
                if (payload?.userId) {
                    
                    c.set('user', payload);
                    authorized = true;
                }
            }
        } catch (e: any) {
            // eslint-disable-next-line no-undef
            console.error(e);
        }
    }
    return authorized ? next() : c.text('Login Required', 401);
};