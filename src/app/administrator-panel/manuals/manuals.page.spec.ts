import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualsPage } from './manuals.page';

describe('ManualsPage', () => {
  let component: ManualsPage;
  let fixture: ComponentFixture<ManualsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
