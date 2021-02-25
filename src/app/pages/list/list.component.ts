import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Employee, EmployeeService } from 'src/app/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  employees: Employee[];
  unSubscribe = new Subject<void>();
  displayedColumns: string[] = ['id', 'name', 'salary', 'age', 'actions'];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listEmployees();
  }

  listEmployees() {
    this.employeeService
      .listEmployees()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((employees) => (this.employees = employees));
  }

  handleEdit(employee: Employee) {
    this.router.navigate(['/form', employee.id]);
  }

  handleNewEmployee() {
    this.router.navigate(['/form']);
  }

  handleDelete(employee: Employee) {
    this.employeeService.deleteEmployee(employee.id).subscribe(
      () => {
        this.employees = this.employees.filter(({ id }) => employee.id !== id);
      },
      () => alert('Erro ao exlcuir, tente novamentem mais tarde!')
    );
  }

  openDialog(employee: Employee) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.handleDelete(employee);
    });
  }

  handleFilter(filter: string) {
    this.employees = this.employees.filter(({ employee_name }) => employee_name.startsWith(filter))

    if (!filter) {
      this.listEmployees();
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
