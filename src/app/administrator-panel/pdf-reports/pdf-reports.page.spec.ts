import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfReportsPage } from './pdf-reports.page';

describe('PdfReportsPage', () => {
  let component: PdfReportsPage;
  let fixture: ComponentFixture<PdfReportsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
