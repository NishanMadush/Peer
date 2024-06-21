export interface IAuthLoginAction {
  isLoggingIn: boolean
  login: any
  errorLogin?: any
}

export interface IAuthLogoutAction {
  isLoggingOut: boolean
  logout: any
  errorLogout?: any
}

export interface IAuthForgotPasswordAction {
  isLoading: boolean
  forgotPassword: any
}

export interface IAuthResetPasswordAction {
  isLoading: boolean
  resetPassword: any
}

export interface IAuthCreatePasswordAction {
  isLoading: boolean
  createPassword: any
}

export interface IAuthRegisterAction {
  isRegistering: boolean
  register: any
}

export interface IAuthUpdatePasswordAction {
  isUpdating: boolean
  updatePassword: any
  errorUpdate?: any
}
