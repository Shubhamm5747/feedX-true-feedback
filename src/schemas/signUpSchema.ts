import {z} from 'zod'

export const UsernameValidation = z
    .string()
    .min(2, "username must be atleast 2 characters")
    .max(20, "username must be under 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")


export const signUpSchema = z.object({
    username : UsernameValidation,
    email : z.string().email({message:'Invalid Email address'}),
    password : z.string().min(6, {message:"Password must be atlest 6characters"})
})