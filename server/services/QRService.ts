import { v4 as uuid } from "uuid";

export class QRService {
  static generateQR(): string {
    return uuid();
  }
}
