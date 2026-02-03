import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewProductPage } from './add-new-product.page';

describe('AddNewProductPage', () => {
  let component: AddNewProductPage;
  let fixture: ComponentFixture<AddNewProductPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
