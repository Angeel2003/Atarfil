import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeriodicTaskDetailPage } from './periodic-task-detail.page';

describe('PeriodicTaskDetailPage', () => {
  let component: PeriodicTaskDetailPage;
  let fixture: ComponentFixture<PeriodicTaskDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicTaskDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
