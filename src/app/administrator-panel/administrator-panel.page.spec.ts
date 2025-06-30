import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministratorPanelPage } from './administrator-panel.page';

describe('AdministratorPanelPage', () => {
  let component: AdministratorPanelPage;
  let fixture: ComponentFixture<AdministratorPanelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
