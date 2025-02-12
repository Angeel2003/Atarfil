import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperatorPanelPage } from './operator-panel.page';

describe('OperatorPanelPage', () => {
  let component: OperatorPanelPage;
  let fixture: ComponentFixture<OperatorPanelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
