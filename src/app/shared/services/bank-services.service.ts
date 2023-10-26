import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DepositOrDrawal, FinantialProduct, GenericResponse } from '../interface/bank.model';

@Injectable({
  providedIn: 'root'
})
export class BankServicesService {

  constructor(private httpClient: HttpClient) { }

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  public getCountries(): Observable<GenericResponse> {
    const service = `${environment.URLService}Country/GetCountries`;
    return this.httpClient.get<GenericResponse>(service)
  }

  public getClientByIdAndProduct(identificationNumber: string, product: number): Observable<GenericResponse> {
    const service = `${environment.URLService}Client/GetClientByIdAndProduct?identificationNumber=${identificationNumber}&product=${product}`;
    return this.httpClient.get<GenericResponse>(service)
  }

  public createFinantialProduct(finantialProduct: FinantialProduct): Observable<GenericResponse> {
    const service = `${environment.URLService}FinantialProduct/CreateFinantialProduct`;
    return this.httpClient.post<GenericResponse>(service, finantialProduct, this.httpOptions)
  }

  public depositOrWithdrawal(depositOrDrawal: DepositOrDrawal): Observable<GenericResponse> {
    const service = `${environment.URLService}FinantialProduct/DepositOrWithdrawal`;
    return this.httpClient.post<GenericResponse>(service, depositOrDrawal, this.httpOptions)
  }

  public getFinantialProducts(): Observable<GenericResponse> {
    const service = `${environment.URLService}FinantialProduct/GetFinantialProducts`;
    return this.httpClient.get<GenericResponse>(service)
  }

  public cancelFinantialProduct(idClient: number, finantialProductType: number, idFinantialProduct?: number ): Observable<GenericResponse> {
    const request = { idClient, idFinantialProduct, finantialProductType };
    const service = `${environment.URLService}FinantialProduct/CancelFinantialProduct`;
    return this.httpClient.post<GenericResponse>(service, request, this.httpOptions)
  }

  public projectionOfBalance(balance?: number, interestRate?: number ): Observable<GenericResponse> {
    const request = { balance, interestRate };
    const service = `${environment.URLService}FinantialProduct/ProjectionOfBalance`;
    return this.httpClient.post<GenericResponse>(service, request, this.httpOptions)
  }
}
