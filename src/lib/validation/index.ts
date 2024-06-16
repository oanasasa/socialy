import { z } from "zod";

export const SignupValidationSchema = z.object({
  name: z.string().min(2, { message: "Too short" }),
  username: z.string().min(2, { message: "Too short" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters" }),
});

export const SigninValidationSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters" }),
});

export const PostValidationSchema = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});

export const UserValidationSchema = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2).max(100),
  username: z.string(),
  email: z.string().email(),
  bio: z.string().min(2).max(100),
});
