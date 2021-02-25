import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Employee, EmployeeService } from 'src/app/employee.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  employeeForm: FormGroup;
  editinEmployee = false;
  currentEmployee: Employee;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const { id } = this.route.snapshot.params;
    this.editinEmployee = !!id;
    this.employeeForm = this.fb.group({
      employee_name: this.fb.control('', [Validators.required]),
      employee_salary: this.fb.control('', [Validators.required]),
      employee_age: this.fb.control('', [Validators.required]),
    });
    if (id) this.handleLoadEmployee(id);
  }

  handleLoadEmployee(id: string) {
    this.employeeService.getEmployee(id).subscribe((employee) => {
      this.currentEmployee = employee;
      this.employeeForm.setValue({
        employee_name: employee.employee_name,
        employee_salary: employee.employee_salary,
        employee_age: employee.employee_age,
      });
    });
  }

  getFieldControl(fieldName: string) {
    return this.employeeForm.get(fieldName).hasError('required');
  }

  handleSave() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      !this.editinEmployee
        ? this.handleSaveNew(formValue)
        : this.handleUpdate(formValue);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  handleUpdate({ employee_name, employee_salary, employee_age }: any) {
    this.employeeService.updateEmployee({
      employee_name,
      employee_salary,
      employee_age,
      id: this.currentEmployee.id,
    }).subscribe(() => alert('Funcionário salvo com sucesso!'), () => this.handleErrorSave());
  }

  handleSaveNew({ employee_name, employee_salary, employee_age }: any) {
    if (!this.editinEmployee) {
      this.employeeService
        .saveEmployee({
          employee_name,
          employee_salary,
          employee_age,
        })
        .subscribe(
          () => this.handleSuccessSave(),
          () => this.handleErrorSave()
        );
    }
  }

  handleSuccessSave() {
    alert('Funcionário salvo com sucesso!');
    this.employeeForm.setValue({
      employee_name: '',
      employee_salary: '',
      employee_age: '',
    });
    this.employeeForm.markAsUntouched();
  }

  handleErrorSave() {
    alert('Ocorreu algo errado! Tente novamente mais tarde');
  }
}
