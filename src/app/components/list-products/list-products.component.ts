import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BankServicesService } from 'src/app/shared/services/bank-services.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinantialProduct } from 'src/app/shared/interface/bank.model';
import { TypeProduct, TypeProductDescription } from 'src/app/shared/interface/bank.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private bankServices: BankServicesService,
    private spinner: NgxSpinnerService) { }

  public listFiantialProducts!: MatTableDataSource<FinantialProduct>;
  public displayedColumns: string[] = ['name', 'identificationNumber', 'typeProduct', 'balance', 'interestRate', 'cancel', 'calculate'];

  ngOnInit(): void {
    this.getFinantialProducts();
  }

  private getFinantialProducts() {
    this.spinner.show();
    this.bankServices.getFinantialProducts()
      .subscribe({
        next: (result) => {
          this.spinner.hide();
            result.data.forEach((product: FinantialProduct) => {
            product.typeProduct = this.getFinantialProductType(product);
            product.balance = this.getBalance(product);
            product.interestRate = this.getInteresRate(product);
          });
          this.listFiantialProducts = new MatTableDataSource(result.data);
          this.listFiantialProducts.sort = this.sort;
          this.listFiantialProducts.paginator = this.paginator;
        },
        error: () => {
          this.spinner.hide();
          this.showAlert('Error al realizar la transacción. Intentelo nuevamente')
        }
      });
  }

  //Método para aplicar filtro en tabla
  public applyFilter(filterValue: any): void {
    if (filterValue != undefined && this.listFiantialProducts) {
      this.listFiantialProducts.filter = filterValue.value.toString().trim().toLowerCase();
    }
  }

  private getFinantialProductType(finantialProduct: FinantialProduct) {
    const finantialProductType = finantialProduct.cdt ? TypeProductDescription.CDT
      : finantialProduct.currentAccount ? TypeProductDescription.CurrentAccount
        : TypeProductDescription.SavingsAccount;
    return finantialProductType;
  }

  private getBalance(finantialProduct: FinantialProduct) {
    const balance = finantialProduct.cdt ? finantialProduct.cdt.balance
      : finantialProduct.currentAccount ? finantialProduct.currentAccount.balance
        : finantialProduct.savingsAccount?.balance;
    return balance;
  }

  private getInteresRate(finantialProduct: FinantialProduct) {
    const interestRate = finantialProduct.cdt ? finantialProduct.cdt.interestRate
      : finantialProduct.savingsAccount ? finantialProduct.savingsAccount.interestRate
        : 'N/A';
    return interestRate;
  }

  public showModalCancel(finantialProduct: FinantialProduct) {
    this.cancelFinantialProduct(finantialProduct)
  }

  public showModalInterestCalculation(finantialProduct: FinantialProduct) {
    let interestCalculation: string = '';
      this.spinner.show();
      const finantialProductObj = finantialProduct.typeProduct === TypeProductDescription.CDT ? finantialProduct.cdt
          : finantialProduct.typeProduct === TypeProductDescription.CurrentAccount ? finantialProduct.currentAccount
            : finantialProduct.savingsAccount;
      this.bankServices.projectionOfBalance(finantialProductObj?.balance, finantialProductObj?.interestRate)
        .subscribe({
          next: (result) => {
            this.spinner.hide();
            result.data.forEach((interest: any) => {
              interestCalculation += '<p><b>'+interest.month+':</b> '+interest.balance +'</p>'
            });
            this.showAlert(interestCalculation, false, 'Proyección');
          },
          error: () => {
            this.spinner.hide();
            this.showAlert('Error al realizar la transacción. Intentelo nuevamente')
          }
        });
  }

  private cancelFinantialProduct(finantialProduct: FinantialProduct) {
    const dialogRef = this.showAlert('¿Esta seguro de que desea eliminar este producto?', true);
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (finantialProduct.idClient && finantialProduct.typeProduct && result) {
        const finantialProductType = finantialProduct.typeProduct === TypeProductDescription.CDT ? TypeProduct.CDT
          : finantialProduct.typeProduct === TypeProductDescription.CurrentAccount ? TypeProduct.CurrentAccount
            : TypeProduct.SavingsAccount;
        const idFinantialProduct = finantialProduct.typeProduct === TypeProductDescription.CDT ? finantialProduct.cdt?.idCDT
            : finantialProduct.typeProduct === TypeProductDescription.CurrentAccount ? finantialProduct.currentAccount?.idCurrentAccount
              : finantialProduct.savingsAccount?.idSavingsAccount;
        this.spinner.show();
        this.bankServices.cancelFinantialProduct(finantialProduct.idClient,finantialProductType, idFinantialProduct)
          .subscribe({
            next: (result) => {
              this.spinner.hide();
              this.showAlert(result.message);
              if(result.message.includes('exitosa')){
                setTimeout(() => {window.location.reload()}, 3000);
              }
            },
            error: () => {
              this.spinner.hide();
              this.showAlert('Error al realizar la transacción. Intentelo nuevamente')
            }
          });
      }
    });
  }

  private showAlert(message: string, showButtons: boolean = false, title?: string): any {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      data: { message, showButtons, title}
    });

    return dialogRef;
  }
}
