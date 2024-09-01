export class ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  paging?: Paging;
  constructor(statusCode: number, message: string, data: T, paging?: Paging) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.paging = paging;
  }

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(200, message, data);
  }

  static successWithPaging<T>(
    data: T,
    paging?: Paging,
    message: string = 'Success',
  ): ApiResponse<T> {
    return new ApiResponse<T>(200, message, data, paging);
  }

  static error<T>(
    message: string,
    statusCode: number = 400,
    data: T = null,
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, message, data);
  }
}
export class Paging {
  size: number;
  total_page: number;
  current_page: number;
}
