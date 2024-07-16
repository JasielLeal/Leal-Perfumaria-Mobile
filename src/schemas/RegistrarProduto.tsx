import { z } from "zod";

export const RegistrarProdutoSchema = z.object({
    name: z.string(),
    value: z.string(),
    code: z.string()
});