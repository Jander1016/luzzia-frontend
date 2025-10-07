"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ContactFormData, ContactSchema } from "@/app/contact/validate.contact"
import { safeContactForm } from "@/services/contactService"
import { useState } from "react"

export function SubscribeForm() {

  const [message, setMessage] = useState('');

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  async function onSubmit(data: ContactFormData) {
    setMessage('');
    try {
      await safeContactForm(data)
      form.reset(); 
      setMessage('success::¡Gracias! Te contactaremos pronto.');
    } catch (error: unknown) {
      let errorMsg = 'Error al enviar. Intenta nuevamente.';
      
      if (error instanceof Error) {
        errorMsg = error.message.split(':')[1];
      }
      
      
      setMessage(`error::${errorMsg}`);
      return
    }
  }
  const [type, text] = message.split('::');
  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:w-1/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa tu email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {message && (
          <p className={`text-sm p-2 rounded ${isError ? 'bg-red-50 text-red-800 border border-red-200' :
              isSuccess ? 'bg-green-50 text-green-800 border border-green-200' :
                'bg-gray-50 text-gray-800'
            }`}>
            {text}
          </p>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
