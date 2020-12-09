import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesubmitComponent } from './salesubmit.component';

describe('SalesubmitComponent', () => {
  let component: SalesubmitComponent;
  let fixture: ComponentFixture<SalesubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
