import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionMaterialManagementPage } from './action-material-management.page';

describe('ActionMaterialManagementPage', () => {
  let component: ActionMaterialManagementPage;
  let fixture: ComponentFixture<ActionMaterialManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMaterialManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
