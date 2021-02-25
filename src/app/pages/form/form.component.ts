import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  employeeForm: FormGroup
  editinEmployee = false

  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.editinEmployee = !!this.route.snapshot.params;
    this.employeeForm = this.fb.group({
      employee_name: this.fb.control('', [Validators.required]),
      employee_salary: this.fb.control('', [Validators.required]),
      employee_age: this.fb.control('', [Validators.required])
    });
  }

  getFieldControl(fieldName: string) {
    return this.employeeForm.get(fieldName).hasError('required')
  }

  handleSave() {
    this.employeeForm.markAllAsTouched();

    if (this.employeeForm.valid) {
      console.log('pode salvar')
    }
  }

}
