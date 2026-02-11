import z from "zod"

export const signupSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(7).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
        message: "Password should min 7 letters, should have atleast one uppercase, one lowercase, one special character, one number"
    }),      
});


export const signinschema = z.object({
    username: z.string(),
    password: z.string()
});

export const searchSchema = z.object({
    query: z.string().min(1, { 
        message: "Search query is required"
    })
});

export const shareSchema = z.object({
    share: z.boolean()
})