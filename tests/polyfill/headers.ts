class FakeHeaders {
  private headers: Map<string, string>;

  constructor(
    init?: {
      [key: string]: string,
    },
  ) {
    this.headers = new Map();
    if (init !== undefined) {
      for (const [key, value] of Object.entries(init)) {
        this.headers.set(key.toLowerCase(), value);
      }
    }
  }

  get(
    key: string,
  ): string | null {
    const result = this.headers.get(key.toLowerCase());
    if (result === undefined) {
      return null;
    }
    return result;
  }

  set(
    key: string,
    value: string,
  ): void {
    this.headers.set(key.toLowerCase(), value);
  }

  delete(
    key: string,
  ): void {
    this.headers.delete(key.toLowerCase());
  }

  has(
    key: string,
  ): boolean {
    return this.headers.has(key.toLowerCase());
  }
}

export default FakeHeaders;
