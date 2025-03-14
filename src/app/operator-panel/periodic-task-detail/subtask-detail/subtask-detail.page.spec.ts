import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubtaskDetailPage } from './subtask-detail.page';

describe('SubtaskDetailPage', () => {
  let component: SubtaskDetailPage;
  let fixture: ComponentFixture<SubtaskDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtaskDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
