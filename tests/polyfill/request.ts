class FakeRequest {
  url: string

  method?: string

  headers?: Headers

  body?: string

  redirect?: 'follow' | 'error' | 'manual'

  constructor(
    input: string,
    init?: {
      method?: string,
      headers?: Headers,
      body?: string,
      redirect?: 'follow' | 'error' | 'manual',
    },
  ) {
    this.url = input;
    if (init !== undefined) {
      const {
        method,
        headers,
        body,
        redirect,
      } = init;

      this.method = method;
      this.headers = headers;
      this.body = body;
      this.redirect = redirect;
    }
  }
}

export default FakeRequest;
