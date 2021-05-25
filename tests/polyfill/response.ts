class FakeResponse {
  body?: string

  headers?: Headers

  status?: number

  statusText?: string

  constructor(
    body: string,
    init?: {
      status?: number,
      statusText?: string,
      headers?: Headers,
    },
  ) {
    this.body = body;
    if (init !== undefined) {
      const {
        status,
        statusText,
        headers,
      } = init;

      this.status = status;
      this.statusText = statusText;
      this.headers = headers;
    }
  }

  get ok(): boolean {
    if (this.status === undefined) {
      return false;
    }
    return this.status >= 200 && this.status <= 299;
  }
}

export default FakeResponse;
