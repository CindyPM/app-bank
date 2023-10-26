import { ListProductsComponent } from './components/list-products/list-products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositOrWithdrawalComponent } from './components/deposit-or-withdrawal/deposit-or-withdrawal.component';
import { ReportComponent } from './components/report/report.component';
import { HomeComponent } from './components/home/home.component';
import { CreateProductComponent } from './components/create-product/create-product.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ListProductsComponent
  },
  {
    path: 'createProduct',
    component: CreateProductComponent
  },
  {
    path: 'depositWithdrawal',
    component: DepositOrWithdrawalComponent
  },
  {
    path: 'report',
    component: ReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
