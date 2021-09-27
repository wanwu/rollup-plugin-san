declare module '*.san' {
  import { defineComponent } from 'san'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}
