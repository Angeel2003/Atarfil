import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectPlacePage } from './select-place.page';

describe('SelectPlacePage', () => {
  let component: SelectPlacePage;
  let fixture: ComponentFixture<SelectPlacePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPlacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
