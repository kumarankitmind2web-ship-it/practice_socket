import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user, expiresIn) => {
  try {
    if (!user || !user._id || !user.email) {
      throw new Error("Invalid user data for token generation");
    }

    const payload = {
      id: user?._id,
      email: user?.email || "",
      username: user?.username || ""
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Error generating token");
  }
};

export default generateToken;
