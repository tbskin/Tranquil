import { Component, NgZone } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CustomerService } from "../providers/customer.service";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  customerForm: FormGroup;

  constructor(
    private customerService: CustomerService,
    public fb: FormBuilder,
    private zone: NgZone
  ) {
    this.customerForm = this.fb.group({
      name: [""],
      qr_id: [""],
    });
  }

  onFormSubmit() {
    if (!this.customerForm.valid) {
      return false;
    } else {
      this.customerService.addCustomer(this.customerForm.value);
    }
  }
}
