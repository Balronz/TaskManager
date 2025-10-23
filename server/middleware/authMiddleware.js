import jwt, { decode } from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if(!token) {
        return res.status(401).json({error: 'No autorizado'});
    }

    const tokenWithoutBearer = token.split(' ')[1];

    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
        
        if(err) {
            return res.status(401).json({error: 'No autorizado'});
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    });
};

export default authMiddleware;