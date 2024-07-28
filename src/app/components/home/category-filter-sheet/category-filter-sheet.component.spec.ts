import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFilterSheetComponent } from './category-filter-sheet.component';

describe('CategoryFilterSheetComponent', () => {
  let component: CategoryFilterSheetComponent;
  let fixture: ComponentFixture<CategoryFilterSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryFilterSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryFilterSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
