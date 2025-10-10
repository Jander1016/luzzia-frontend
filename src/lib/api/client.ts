import { ApiError } from '@/types/api'

// API client configuration
interface ApiClientConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
}

class ApiClient {
  private baseURL: string
  private timeout: number
  private retries: number
  private retryDelay: number
  private defaultHeaders: HeadersInit

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    this.timeout = config.timeout || 10000 // Reducido de 15s a 10s
    this.retries = config.retries || 1 // Reducido de 2 a 1 retry
    this.retryDelay = config.retryDelay || 500 // Reducido de 1s a 500ms
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Optimización de compresión
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    // HTTP error handling
    if (!response.ok) {
      let errorData: ApiError
      
      try {
        errorData = await response.json()
      } catch {
        errorData = {
          error: 'HTTP_ERROR',
          message: response.statusText || `HTTP ${response.status}`,
          statusCode: response.status,
          timestamp: new Date().toISOString()
        }
      }

      throw new Error(`Error de API ${response.status}: ${errorData.message}`)
    }

    // Empty response handling
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('Se esperaba respuesta JSON de la API')
    }

    let data: unknown
    try {
      data = await response.json()
    } catch {
      throw new Error('Error al parsear respuesta JSON')
    }

    // If response comes directly without ApiResponse wrapper
    if (Array.isArray(data) || (data && !(data as Record<string, unknown>).hasOwnProperty('data'))) {
      return data as T
    }

    // Basic validation of wrapped response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Formato de respuesta de API inválido')
    }

    return (data as { data: T }).data
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    try {
      // Timeout configurable
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)

    } catch (error) {
      // Reintentos con backoff exponencial
      if (attempt < this.retries && !(error instanceof Error && error.name === 'AbortError')) {
        console.warn(`API request failed (attempt ${attempt}/${this.retries}):`, error)
        await this.sleep(this.retryDelay * Math.pow(2, attempt - 1))
        return this.request<T>(endpoint, options, attempt + 1)
      }

      // Manejo de errores específicos
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout: The server took too long to respond (>${this.timeout}ms)`)
        }
        if (error.message.includes('fetch')) {
          throw new Error('Network error: Please check your internet connection')
        }
        throw error
      }
      
      throw new Error('Unknown error occurred during API request')
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, options?: Omit<RequestInit, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    })
  }

  async post<T>(endpoint: string, data?: unknown, options?: Omit<RequestInit, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: Omit<RequestInit, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async delete<T>(endpoint: string, options?: Omit<RequestInit, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    })
  }

  // Utilidades para testing y configuración
  updateConfig(config: Partial<ApiClientConfig>): void {
    if (config.baseURL) this.baseURL = config.baseURL
    if (config.timeout) this.timeout = config.timeout
    if (config.retries) this.retries = config.retries
    if (config.retryDelay) this.retryDelay = config.retryDelay
  }

  getBaseURL(): string {
    return this.baseURL
  }
}

// Instancia singleton
export const apiClient = new ApiClient()

// Export para testing
export { ApiClient }