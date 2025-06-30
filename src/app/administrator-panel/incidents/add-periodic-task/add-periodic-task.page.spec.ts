import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPeriodicTaskPage } from './add-periodic-task.page';

describe('AddPeriodicTaskPage', () => {
  let component: AddPeriodicTaskPage;
  let fixture: ComponentFixture<AddPeriodicTaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPeriodicTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
