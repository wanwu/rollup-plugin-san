declare module '*.san' {
  import { defineComponent } from 'san'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
