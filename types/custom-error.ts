export interface ErrorOptions {
  /**
   * The HTTP status code to return a custom error response to the client.
   * Excepts a valid HTTP status code or an array of valid status code.
   */
  errorCode: number | number[];

  /**
   * The path and file name of the custom error page for this HTTP status code.
   * For example: `/error-pages/403-forbidden.html`
   */
  responsePath: string;

  /**
   * The HTTP status code to return to the client along with the custom error page.
   * If not specified, defaults to the original error code.
   */
  responseCode?: number;
}
