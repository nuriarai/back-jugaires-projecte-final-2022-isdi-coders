export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterDataCredentials extends Credentials {
  email: string;
}
