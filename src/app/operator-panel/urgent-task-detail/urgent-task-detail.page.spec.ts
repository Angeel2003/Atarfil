import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrgentTaskDetailPage } from './urgent-task-detail.page';

describe('UrgentTaskDetailPage', () => {
  let component: UrgentTaskDetailPage;
  let fixture: ComponentFixture<UrgentTaskDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentTaskDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
