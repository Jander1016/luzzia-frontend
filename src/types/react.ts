import { JSXElementConstructor, ReactElement } from 'react'

export interface ReactFC<T = Record<string, unknown>> {
  (props: T): ReactElement<unknown, string | JSXElementConstructor<unknown>> | null
  displayName?: string
}