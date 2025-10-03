import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio").max(100),
  email: z.string().email("El email no es válido").min(5).max(100),
});

export type ContactFormData = z.infer<typeof ContactSchema>;