export class AppError extends Error {
  constructor(
    public message: string, 
    public statusCode: number = 400,
    public errorCode?: string // Contoh: 'AUTH_EMAIL_EXISTS'
  ) {
    super(message);
  }
}