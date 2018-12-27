import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRepositoryComponent } from './file.component';

describe('FileRepositoryComponent', () => {
  let component: FileRepositoryComponent;
  let fixture: ComponentFixture<FileRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
