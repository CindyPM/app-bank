export interface GenericResponse {
  isValid: boolean,
  message: string,
  data: any
}

export interface FinantialProduct {
  idClient?: number,
  name: string,
  identificationType: number,
  identificationNumber: string,
  idSavingsAccount?: number,
  idCurrentAccount?: number,
  idCDT?: number,
  legalRepresentative?: {
    name: string,
    identificationType: number,
    identificationNumber: string,
    mobileNumber: string,
    idCountry: number
  },
  savingsAccount?: Product,
  currentAccount?: Product,
  cdt?: Product,

  typeProduct?: string,
  balance?: number
  interestRate?: number | undefined | 'N/A'
}

export interface Product {
  balance: number,
  interestRate?: number,
  idCurrentAccount?: number,
  idCDT?: number,
  idSavingsAccount?: number
}

export interface DepositOrDrawal {
  action: number,
  typeProduct: number,
  numIdentification: string,
  amount: number
}
