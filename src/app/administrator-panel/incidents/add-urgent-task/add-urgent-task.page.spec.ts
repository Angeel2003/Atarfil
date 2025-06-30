import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUrgentTaskPage } from './add-urgent-task.page';

describe('AddUrgentTaskPage', () => {
  let component: AddUrgentTaskPage;
  let fixture: ComponentFixture<AddUrgentTaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUrgentTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
