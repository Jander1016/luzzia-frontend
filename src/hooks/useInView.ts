'use client'

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView(options: UseInViewOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options

  const [inView, setInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)


  // Callback clásico para IntersectionObserver
  const handleIntersection = (entry: IntersectionObserverEntry) => {
    const isIntersecting = entry.isIntersecting
    setInView(isIntersecting)
    if (isIntersecting && triggerOnce) {
      setHasTriggered(true)
    }
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    if (triggerOnce && hasTriggered) return

    const observer = new IntersectionObserver(
      ([entry]) => handleIntersection(entry),
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
    // handleIntersection no se incluye en deps para evitar recrear observer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return {
    ref: elementRef,
    inView: triggerOnce ? (hasTriggered || inView) : inView,
    hasTriggered
  }
}