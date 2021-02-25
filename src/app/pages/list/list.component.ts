import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Employee, EmployeeService } from 'src/app/employee.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  employees: Employee[];
  unSubscribe = new Subject<void>();
  displayedColumns: string[] = ['id', 'name', 'salary', 'age', 'actions'];

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.employeeService
      .listEmployees()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((employees) => (this.employees = employees));
  }

  handleEdit(employee: Employee) {
    this.router.navigate(['/form', employee.id])
  }

  handleNewEmployee() {
    this.router.navigate(['/form']);
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
