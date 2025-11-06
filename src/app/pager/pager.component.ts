import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [],
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss',
})
export class PagerComponent {
  @Input()
  set itemCount(value: number) {
    this._itemCount = value;
    this.updatePageCount();
  }
  get itemCount() {
    return this._itemCount;
  }
  _itemCount: number = 0;
  @Input()
  set pageSize(value: number) {
    this._pageSize = value;
    this.updatePageCount();
  }
  get pageSize() {
    return this._pageSize;
  }
  _pageSize: number = 0;
  _pageCount: number = 5;
  updatePageCount() {
    this._pageCount = Math.ceil(this.itemCount / this.pageSize);
  }

  _pageIndex: number = 0;
  @Output() pageIndexChange = new EventEmitter<number>();
  @Input()
  get pageIndex() {
    return this._pageIndex;
  }
  set pageIndex(value: number) {
    this._pageIndex = value;
    this.pageIndexChange.emit(this.pageIndex);
  }

  moveToNextPage() {
    if (this.canMoveToNextPage) {
      this.pageIndex++;
    }
  }
  moveToPreviousPage() {
    if (this.canMoveToPreviousPage) {
      this.pageIndex--;
    }
  }
  moveToLastPage() {
    this.pageIndex = this._pageCount - 1;
  }
  moveToFirstPage() {
    this.pageIndex = 0;
  }

  get canMoveToNextPage(): boolean {
    return this.pageIndex < this._pageCount - 1 ? true : false;
  }
  get canMoveToPreviousPage(): boolean {
    return this.pageIndex >= 1 ? true : false;
  }
}
