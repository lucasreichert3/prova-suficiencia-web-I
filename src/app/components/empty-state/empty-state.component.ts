import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent implements OnInit {

  @Input() showMessage: boolean;
  @Input() title: string;
  @Input() detail: string;
  @Input() buttonMessage: string;
  @Output() buttonEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  handleButton() {
    this.buttonEvent.emit();
  }

}
