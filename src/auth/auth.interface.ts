export interface InputSignIn {
  email: string;
  password: string;
}

export interface InputSignUp {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface InputForgotPass {
  email: string;
  newPassword: string;
}

export interface AuthToken {
  accesToken: string;
}
