import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoreographyModelComponent } from './choreography-model.component';

describe('ChoreographyModelComponent', () => {
  let component: ChoreographyModelComponent;
  let fixture: ComponentFixture<ChoreographyModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoreographyModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoreographyModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
