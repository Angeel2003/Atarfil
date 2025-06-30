import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedTaskDetailPage } from './completed-task-detail.page';

describe('CompletedTaskDetailPage', () => {
  let component: CompletedTaskDetailPage;
  let fixture: ComponentFixture<CompletedTaskDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedTaskDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
