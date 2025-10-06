import { ContactFormData } from "@/app/contact/validate.contact";
import electricityService from "./electricityService";

 export async function safeContactForm(data: ContactFormData): Promise<void> {
  try {
    await electricityService.createContact(data);
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error; 
  }
}

    