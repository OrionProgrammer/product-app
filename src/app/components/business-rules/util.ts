import { Buffer } from "buffer";

export default class Util {

    static encodeBase64String(str: string): string {
        return Buffer.from(str, 'utf-8').toString('base64');
      }
    
      static decodeBase64String(encoded: string): string {
        return Buffer.from(encoded, 'base64').toString('utf-8');
      }

}