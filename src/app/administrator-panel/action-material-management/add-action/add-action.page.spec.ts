import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddActionPage } from './add-action.page';

describe('AddActionPage', () => {
  let component: AddActionPage;
  let fixture: ComponentFixture<AddActionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
