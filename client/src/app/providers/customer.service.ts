import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastController } from "@ionic/angular";
import { Observable } from "rxjs";
import { Customer } from "../../assets/shared/customer";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  /**
    * @name items 
    * @type {Array} 
    * @public
    * @description              Used to store the retrieved documents from the 
                                MongoDB database
    */
  public items: Array<any>;

  /**
    * @name _HOST 
    * @type {String} 
    * @private
    * @description              The network IP Address and port number that the
                                node application is running on
    */
  private _SERVER: string = "http://localhost:9000/";

  constructor(
    public http: HttpClient,
    public toastController: ToastController
  ) {
    this.retrieveCustomers();
    console.dir("Customers were successfully obtained");
  }

  /**
   * Retrieve the documents from the MongoDB database
   * on the ionViewDidEnter lifecycle event
   *
   * @public
   * @method ionViewDidEnter
   * @return {None}
   */
  ionViewDidEnter(): void {}

  retrieveCustomers() {
    this.http.get(this._SERVER + "api/customers").subscribe(
      (data: any) => {
        this.items = data.records;
        this.displayNotification("Customers data was successfully obtained");
        console.dir(this.items);
      },
      (error: any) => {
        console.dir(error);
        this.displayNotification("Error in obtaining customer");
      }
    );
  }

  viewCustomer(item: any): Observable<any> {
    let customerId = item._id;
    let url = this._SERVER + "api/customers/" + customerId;

    return this.http.get(url);
  }

  addCustomer(customer: Customer) {
    let url = this._SERVER + "api/customers";
    this.http.post(url, customer).subscribe(
      (data: any) => {
        this.retrieveCustomers();
        this.displayNotification(
          "Customer successfully added. Message from server: " + data.message
        );
      },
      (err: any) => {
        console.dir(err);
        this.displayNotification("Error in adding customer");
      }
    );
  }

  updateCustomer(customer: Customer): Observable<any> {
    let url = this._SERVER + "api/customers/" + customer._id;
    return this.http.put(url, customer._id);
  }

  deleteCustomer(item: any) {
    // Retrieve the document ID from the supplied parameter and
    // define the URL which triggers the node route for deleting the document
    let customerId = item._id;
    let url = this._SERVER + "api/customers/" + customerId;

    this.http.delete(url).subscribe(
      (data: any) => {
        // If the request was successful notify the user
        this.retrieveCustomers();
        this.displayNotification(
          data.records.name + " was successfully deleted"
        );
      },
      (error: any) => {
        console.dir(error);
        this.displayNotification("Error in deleting customer");
      }
    );
  }

  /**
   * Displays a message to the user
   *
   * @public
   * @method displayNotification
   * @param item    {String}      The message to be displayed
   * @return {None}
   */
  async displayNotification(message: string): Promise<void> {
    let toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }
}
