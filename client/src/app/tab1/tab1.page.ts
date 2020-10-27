import { Component } from "@angular/core";
import { CustomerService } from "../providers/customer.service";
import {
  ModalController,
  NavController,
  ToastController,
} from "@ionic/angular";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  qrGenerated = false;
  Customers: any = [];
  qrCodeValue = null;
  generateQRCodeButtonText: String = "Generate QR Code";

  constructor(private customerService: CustomerService) {}

  generateQRCode() {
    // Call to service which will talk to backend which will talk to DB to get QR for this customer. Backend should do the mapping of customer to QR.

    console.log(this.customerService.items[2]);
    this.customerService
      .updateCustomer(this.customerService.items[2])
      .subscribe(
        (data: any) => {
          console.dir(data);
          this.customerService.displayNotification(
            data.records.name + " was successfully obtained"
          );
          this.qrCodeValue = data.records.qr_id;
          this.qrGenerated = true;
          this.customerService.retrieveCustomers();
          this.generateQRCodeButtonText = "Re-generate QR Code";
        },
        (err: any) => {
          console.dir(err);
          this.customerService.displayNotification(
            "Error in obtaining customer"
          );
          this.qrGenerated = false;
          this.generateQRCodeButtonText = "Generate QR Code";
        }
      );
  }

  showGenerateQRInstructions() {
    if (this.qrGenerated) {
      return "Click the \"Re-generate QR Code\" button if this QR code fails";
    }

    return "Click the \"Generate QR Code\" button to obtain your QR code for scanning.";
  }
}
