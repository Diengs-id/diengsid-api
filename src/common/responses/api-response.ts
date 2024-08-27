export class ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, mesaage: string = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(200, mesaage, data);
  }

  static error<T>(
    message: string,
    statusCode: number = 400,
    data: T = null,
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, message, data);
  }
}
