import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (payload) => {
    const secretKey = process.env.JWT_SECRET; //Clave guardada en .env
    const options = {
        expiresIn: "1d"
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
};

export default generateToken;