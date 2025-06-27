export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse extends AuthTokens {
  data: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export interface LoginResponse extends AuthTokens {}

export interface RefreshTokenResponse
  extends Omit<AuthTokens, 'refresh_token'> {}

export interface RefreshTokenPayload
  extends Omit<RegisterPayload, 'password' | 'username'> {
  id: number;
  role: string;
}

export interface JwtPayload extends RefreshTokenPayload {}

export interface VerifyPayload {
  email: string;
  code: number;
  type: 'register' | 'forgot';
  newPassword?: string;
}

export interface ForgotPayload
  extends Omit<VerifyPayload, 'code' | 'type' | 'newPassword'> {}
