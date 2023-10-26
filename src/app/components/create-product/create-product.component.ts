import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DocumentType, TypeProduct } from 'src/app/shared/interface/bank.enum';
import { FinantialProduct } from 'src/app/shared/interface/bank.model';
import { BankServicesService } from 'src/app/shared/services/bank-services.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {

  constructor(public dialog: MatDialog, private bankServices: BankServicesService,
    private spinner: NgxSpinnerService, private router: Router) { }


  public countries: any[] | undefined;
  public numIdentification: string = '';
  public typeProduct: number = 0;
  public showClientData: boolean = false;
  public isLegalRepresentative: boolean = false;
  public clientExist: boolean = false;
  public client: any;
  private regexPhone: string = '';
  public clientForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    identificationType: new FormControl('', [Validators.required]),
    isLegalRepresentative: new FormControl(false),
    nameRL: new FormControl(''),
    numIdentificationRL: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]*$')]),
    country: new FormControl(''),
    phone: new FormControl(''),
    balance: new FormControl('', [Validators.required]),
    interestRate: new FormControl('', [Validators.pattern('^[0-9.]*$')])
  });


  public getClient(): void {
    this.spinner.show();
    this.bankServices.getClientByIdAndProduct(this.numIdentification, this.typeProduct)
      .subscribe({
        next: (result) => {
          this.spinner.hide();
          if (result.isValid) {
            this.showClientData = true;

            if (result.data) {
              this.client = result.data;
              this.clientExist = true;
              this.clientForm.controls.name.setValue(result.data.name);
              this.clientForm.controls.identificationType.setValue(result.data.identificationType);
              this.clientForm.controls.name.disable();
              this.clientForm.controls.identificationType.disable();
            }
          } else {
            this.spinner.hide();
            this.showAlert(result.message)
          }
        },
        error: () => { this.showAlert('Error al realizar la transacción. Intentelo nuevamente') }
      });
  }

  public setValidatorsLegalRepresentative(): void {
    this.getCountries();
    this.clientForm.controls.country.addValidators([Validators.required]);
    this.clientForm.controls.numIdentificationRL.addValidators([Validators.required]);
    this.clientForm.controls.nameRL.addValidators([Validators.required]);
  }

  private getCountries() {
    this.bankServices.getCountries()
      .subscribe({
        next: (result) => {
          this.spinner.hide();
          if (result.isValid) {
            this.countries = result.data;
          } else {
            this.spinner.hide();
            this.showAlert(result.message)
          }
        },
        error: () => { this.showAlert('Error al consultar paises. Intentelo nuevamente') }
      });
  }

  public setValidatorCountry(event: any) {
    const code = this.countries?.find(x => x.idCountry == event.target.value).code;
    this.regexPhone = "^\\" + code + "\\d+$";
    this.clientForm.controls.phone.addValidators([Validators.required, Validators.pattern(this.regexPhone)]);
  }

  public setValidatorsTypeProduct(): void {
    if (this.typeProduct !== TypeProduct.CurrentAccount) {
      this.clientForm.controls.interestRate.addValidators([Validators.required]);
    }
  }

  public createProduct(): void {
    if (this.clientForm.valid) {
      let finantialProduct: FinantialProduct;

      if (this.client) {
        finantialProduct = this.client;
      } else {
        finantialProduct = {
          name: this.clientForm.controls.name.value!,
          identificationType: +this.clientForm.controls.identificationType.value!,
          identificationNumber: this.numIdentification
        }
      }

      if (this.clientForm.controls.isLegalRepresentative.value == true) {
        finantialProduct = {
          ...finantialProduct,
          legalRepresentative: {
            name: this.clientForm.controls.nameRL.value!,
            identificationType: DocumentType.CC,
            identificationNumber: this.clientForm.controls.numIdentificationRL.value!,
            mobileNumber: this.clientForm.controls.phone.value!,
            idCountry: +this.clientForm.controls.country.value!
          }
        }
      }

      const product = this.typeProduct == TypeProduct.SavingsAccount ? 'savingsAccount' :
        this.typeProduct == TypeProduct.CurrentAccount ? 'currentAccount' : 'cdt';
      finantialProduct = {
        ...finantialProduct,
        [product]: {
          balance: +this.clientForm.controls.balance.value!.replace(/\D/g, ''),
          interestRate: TypeProduct.SavingsAccount ? environment.interestRateSavingsAccount : +this.clientForm.controls.interestRate.value!
        }
      }
      this.spinner.show();
      this.bankServices.createFinantialProduct(finantialProduct)
        .subscribe({
          next: (result) => {
            this.spinner.hide();
            this.showAlert(result.message);
            setTimeout(() => { this.router.navigateByUrl("/products") }, 3000);
          },
          error: () => {
            this.spinner.hide();
            this.showAlert('Error al realizar la transacción. Intentelo nuevamente')
          }
        });
    }
  }

  private showAlert(message: string, showButtons: boolean = false): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      data: { message, showButtons }
    });
  }

  //Método para formatear valor a moneda
  public formatCurrency(value: any) {
    let number = value.value.replace(/\D/g, '').substring(0, 11);
    let formatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
    const newNumber = number !== '' ? formatter.format(+number) : '';
    this.clientForm.controls.balance.setValue(newNumber);
  }

  public validateKey(event: any, control: string) {
    const regex = control === 'interestRate' ? '^[0-9.]*$' :
      control === 'numeric' ? '^[0-9]*$' :
        control === 'phone' ? this.regexPhone
          : '^[a-zA-Z0-9]*$';
    if (new RegExp(regex).test(event.key)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
