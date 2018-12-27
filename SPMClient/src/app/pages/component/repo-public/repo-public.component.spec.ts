import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoPublicComponent } from './repo-public.component';

describe('RepoPublicComponent', () => {
  let component: RepoPublicComponent;
  let fixture: ComponentFixture<RepoPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepoPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
