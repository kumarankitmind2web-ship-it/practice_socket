import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {useSelector, useDispatch} from "react-redux";

dotenv.config();

const AuthMiddleware = (req, res, next) => {
    const authHeader = req.headers?.authorization;
    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Unauthorized"});
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Token missing.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        const message =
            error?.response?.data?.message || error?.response?.message || error?.message || "Something went wrong";
        return res.status(401).json({message});
    }
};

export default AuthMiddleware;
