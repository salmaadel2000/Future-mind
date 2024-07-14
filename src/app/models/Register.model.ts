export class User {
  constructor(
    public username: string,
    public email: string,
    public password: string,
    public phone: string,
    public password_confirmation: string,
    public role: 'parent' | 'admin',
    public id?: number
  ) {}
}

export class Auth {
  constructor(
    public message: string,
    public access_token: string,
    public user: User,
    public additional_data?: { parent: boolean }
  ) {}
}

export class Login {
  constructor(
    public email: string,
    public password: string
  ) {}
}
