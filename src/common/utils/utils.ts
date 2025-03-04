import axios, { AxiosResponse, Method } from 'axios';
import { ErrorMessage, RefStrings } from '../constants';

export class Utils {
  public static async externalRequest(
    provider: string,
    type: string,
    url: string,
    body: any = null,
    headers: Record<string, string> = {},
  ): Promise<any> {
    try {
      const method: string | undefined =
        RefStrings.meta.requestType[
          type.toLowerCase() as keyof typeof RefStrings.meta.requestType
        ];
      if (!method) {
        throw new Error(ErrorMessage.systemError.invalidRequest.message);
      }

      const config = {
        method: method as Method,
        url: url,
        headers: headers,
        data: body,
      };

      // console.log("REQ :", config);
      const response: AxiosResponse = await axios(config);

      // console.log(`Provider: ${provider}`, response.data);

      return response.data;
    } catch (error: any) {
      console.log(`ERROR ${provider} :`, error);
      if (error?.response?.data) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data ||
          error.message;
        throw ErrorMessage.systemError.externalErrorWithData(message);
      } else {
        throw ErrorMessage.systemError.externalError;
      }
    }
  }
}
