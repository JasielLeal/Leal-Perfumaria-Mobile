import { z } from "zod";

export const EditProduto = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    code: z.string().optional()
});