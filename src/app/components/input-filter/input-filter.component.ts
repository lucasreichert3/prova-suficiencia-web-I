import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.scss'],
})
export class InputFilterComponent implements OnInit, OnDestroy {
  inputForm: FormGroup;
  hasFilter = false;
  @Output() filterChanged = new EventEmitter<string>();
  unSubscribe = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      filter: this.fb.control(''),
    });

    this.handleInputChanges();
  }

  handleInputChanges() {
    this.inputForm.valueChanges
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(() => (this.hasFilter = false));
  }

  handleSearch() {
    if (!this.hasFilter) {
      const { filter } = this.inputForm.value;
      this.filterChanged.emit(filter);
    } else {
      this.handleCleanFilter();
    }
    this.hasFilter = !this.hasFilter;
  }

  handleCleanFilter() {
    this.inputForm.setValue({ filter: '' });
    this.filterChanged.emit('');
  }

  hasInputValue(): boolean {
    return !!this.inputForm.get('filter').value;
  }

  ngOnDestroy() {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
