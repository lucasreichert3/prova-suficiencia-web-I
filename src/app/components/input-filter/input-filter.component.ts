import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-filter',
  templateUrl: './input-filter.component.html',
  styleUrls: ['./input-filter.component.scss'],
})
export class InputFilterComponent implements OnInit {
  inputForm: FormGroup;
  @Output() filterChanged = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      filter: this.fb.control(''),
    });
  }

  handleSearch() {
    const { filter } = this.inputForm.value;
    this.filterChanged.emit(filter);
  }

  handleCleanFilter() {
    this.inputForm.setValue({ filter: '' });
    this.handleSearch();
  }

  hasInputValue(): boolean {
    return !!this.inputForm.get('filter').value;
  }
}
