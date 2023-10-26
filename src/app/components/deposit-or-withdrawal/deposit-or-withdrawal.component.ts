import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DepositOrDrawal } from 'src/app/shared/interface/bank.model';
import { BankServicesService } from 'src/app/shared/services/bank-services.service';

@Component({
  selector: 'app-deposit-or-withdrawal',
  templateUrl: './deposit-or-withdrawal.component.html',
  styleUrls: ['./deposit-or-withdrawal.component.scss']
})
export class DepositOrWithdrawalComponent {

  constructor(public dialog: MatDialog, private bankServices: BankServicesService,
    private spinner: NgxSpinnerService) { }

  public depositWithdralForm = new FormGroup({
    action: new FormControl('0', [Validators.required]),
    typeProduct: new FormControl('0', [Validators.required]),
    numIdentification: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]),
    amount: new FormControl()
  })

  public createDepositOrWithdrawl() {
    if (this.depositWithdralForm.valid) {
      let depositOrDrawal: DepositOrDrawal = {
        action: +this.depositWithdralForm.controls.action.value!,
        typeProduct: +this.depositWithdralForm.controls.typeProduct.value!,
        numIdentification: this.depositWithdralForm.controls.numIdentification.value!,
        amount: +this.depositWithdralForm.controls.amount.value!
      }
      this.spinner.show();
      this.bankServices.depositOrWithdrawal(depositOrDrawal)
        .subscribe({
          next: (result) => {
            this.spinner.hide();
            this.showAlert(result.message);
            if (result.message.includes('exitosa')) {
              this.depositWithdralForm.reset();
            }
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

}
