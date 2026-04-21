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
    username: z.string(),
    password: z.string(),
});