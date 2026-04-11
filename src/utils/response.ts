export class ApiResponse {
  static success(res: any, data: any, message = "Success", status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data
    })
  }

  static error(res: any, data: any, message = "Error", status = 500) {
    return res.status(status).json({
      success: false,
      message
    })
  }
}