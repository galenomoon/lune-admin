export interface LoginResponse {
  user: {
    name: string | null;
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
}
