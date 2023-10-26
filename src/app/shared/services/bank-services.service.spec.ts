import { TestBed } from '@angular/core/testing';

import { BankServicesService } from './bank-services.service';

describe('BankServicesService', () => {
  let service: BankServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
