declare module "@netlify/edge-functions" {
  export interface Context {
    next: () => Promise<Response>;
  }

  export interface Config {
    path?: string;
  }
}
