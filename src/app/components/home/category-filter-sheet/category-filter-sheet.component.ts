import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-category-filter-sheet',
  templateUrl: './category-filter-sheet.component.html',
  styleUrls: ['./category-filter-sheet.component.css']
})
export class CategoryFilterSheetComponent {
  categories: string[] = ['All','Frame', 'Rasin', 'Other'];
  selectedCategory: string;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<CategoryFilterSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.selectedCategory = data.selectedCategory || 'All';
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  applyFilter(): void {
    this.bottomSheetRef.dismiss(this.selectedCategory);
  }
}
