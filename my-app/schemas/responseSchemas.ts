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

const loginSchema = z.object({
    username: z.string(),
    password: z.string()
});

export type LoginSchema = z.infer<typeof loginSchema>;