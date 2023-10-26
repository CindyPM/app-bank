import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositOrWithdrawalComponent } from './deposit-or-withdrawal.component';

describe('DepositOrWithdrawalComponent', () => {
  let component: DepositOrWithdrawalComponent;
  let fixture: ComponentFixture<DepositOrWithdrawalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepositOrWithdrawalComponent]
    });
    fixture = TestBed.createComponent(DepositOrWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
