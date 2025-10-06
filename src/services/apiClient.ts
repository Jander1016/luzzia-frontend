import { ContactFormData } from "@/app/contact/validate.contact";

export class HTTPError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function safeFetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new HTTPError(`Error HTTP ${res.status}`, res.status);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(id);
  }
}

export async function postJson<T>(
  url: string,
  data: ContactFormData,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    body: JSON.stringify(data),
    ...options,
  });
  if (!res.ok) {
    throw new HTTPError(`Error HTTP ${res.status}`, res.status);
  }
  return (await res.json()) as T;
}
