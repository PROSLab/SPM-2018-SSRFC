import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PswRecoveryComponent } from './psw-recovery.component';

describe('PswRecoveryComponent', () => {
  let component: PswRecoveryComponent;
  let fixture: ComponentFixture<PswRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PswRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PswRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
