import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {}

  isLoading = false;

  show() {
    this.isLoading = true;
    return this.isLoading;
  }

  hide() {
    this.isLoading = false;
    return this.isLoading;
  }
}
