import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectZonePage } from './select-zone.page';

describe('SelectZonePage', () => {
  let component: SelectZonePage;
  let fixture: ComponentFixture<SelectZonePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectZonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
