import z from 'zod';

export const gameSchema = z.object({
    results: z.array(
        z.object({
            name: z.string(),
            released: z.string(),
            background_image: z.url(),
        })
    )
});

export const LoginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Schema for receiving login information from the client.
export const UserInfoSchema = z.object({
    username: z.string(),
    password: z.string(),
});

// Schema for error responses from the server.
const responseSchema = z.object({
    message: z.string(),
    status: z.number(),
});

export type ResponseSchema = z.infer<typeof responseSchema>;