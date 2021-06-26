class FakeHeaders {
  private headers: Map<string, string>;

  constructor(
    init?: FakeHeaders | {
      [key: string]: string,
    },
  ) {
    this.headers = new Map();
    if (init instanceof FakeHeaders) {
      for (const [key, value] of init.headers.entries()) {
        this.headers.set(key, value);
      }
    } else if (init !== undefined) {
      for (const [key, value] of Object.entries(init)) {
        this.headers.set(key.toLowerCase(), value);
      }
    }
  }

  toString(): string {
    const result = [];
    for (const [key, value] of this.headers) {
      result.push(`${key}: ${value}`);
    }
    return result.join('\n');
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
