
import { useState, useEffect, useCallback } from 'react'

export function useCookie(name: string, defaultValue: string = '') {
  // Sempre inicia com defaultValue para evitar problemas de hidratação
  const [value, setValue] = useState<string>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Função para ler o cookie
  const getCookie = useCallback((name: string): string => {
    if (typeof document === 'undefined') return defaultValue
    
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || defaultValue
    }
    return defaultValue
  }, [defaultValue])

  // Função para definir o cookie
  const setCookie = useCallback((newValue: string, maxAge: number = 60 * 60 * 24 * 7) => {
    if (typeof document === 'undefined') return
    
    document.cookie = `${name}=${newValue}; path=/; max-age=${maxAge}`
    setValue(newValue)
  }, [name])

  useEffect(() => {
    // Marca que a hidratação foi concluída
    setIsHydrated(true)
    
    // Lê o valor do cookie após a hidratação
    const cookieValue = getCookie(name)
    setValue(cookieValue)
  }, [name, getCookie])

  // Durante SSR e antes da hidratação, sempre retorna defaultValue
  // Após hidratação, retorna o valor real do cookie
  return [isHydrated ? value : defaultValue, setCookie] as const
}
