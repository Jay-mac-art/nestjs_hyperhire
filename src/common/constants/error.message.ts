import * as dayjs from 'dayjs';

export class ErrorMessage {
  static errorMessage(
    message: string,
    status: number,
    customErrorNumber: number,
    additionalObject: { [key: string]: string | boolean } = null,
  ) {
    const myResponse = {
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      message: message,
      status: status,
      customErrorNumber: customErrorNumber,
    };

    if (additionalObject !== null) {
      return {
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        message: message,
        status: status,
        customErrorNumber: customErrorNumber,
        ...additionalObject,
      };
    } else {
      return myResponse;
    }
  }
  static uuidErr(id: string) {
    return {
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      message: `invalid id ${id}`,
      status: 400,
      customErrorNumber: -3,
    };
  }

  // error messages
  public static error = {
    emailError: 'Invalid email',
  };
  public static systemError = {
    invalidRequest: this.errorMessage('Invalid Request', 401, 0),
    oopsSomethingWentWrong: this.errorMessage(
      'Oops! Something went wrong',
      500,
      -1,
    ),
    externalProviderIssue: this.errorMessage(
      'Please try in some time!',
      401,
      -2,
    ),
    notFound: this.errorMessage(
      'Route you are requesting is not found',
      404,
      404,
    ),
    notificationError: (error: string) =>
      this.errorMessage(`Notification Error: ${error}`, 400, -3),
    externalError: this.errorMessage(
      'Error occored while fetching data over the network',
      400,
      -4,
    ),
    externalErrorWithData: (data: any) => this.errorMessage(data, 400, -5),
  }; // -1000000 to 99999

  // 100000 - 100100
  public static quest = {
    walletAlreadyExists: this.errorMessage(
      'Wallet with given id already exists',
      400,
      100000,
    ),
  }
   
}
