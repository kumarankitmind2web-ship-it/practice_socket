import { z } from "zod";

const userValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  avatar: z.string().url("Invalid URL").optional(),
  age: z.number().min(18, "You must be at least 18"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default userValidationSchema;
