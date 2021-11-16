export class UnknownMethodError extends Error {
  constructor(method: string, known: string[]) {
    super(`Unknown method ${method} (known methods: ${known})`);
  }
}
