export type AuthResponse = {
  userId: string;
  email: string;
  access_token: string;

  // register lo devuelve
  name?: string;
  isActive?: boolean;

  // login lo devuelve (pero NO lo usaremos)
  password?: string;
};
