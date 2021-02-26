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
  employees: Employee[] = [];
  unSubscribe = new Subject<void>();
  displayedColumns: string[] = ['id', 'name', 'salary', 'age', 'actions'];
  emptyState = false;
  loading = false;
  page = 0;
  totalRecord = 0;
  hasFilter = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listEmployees();
  }

  listEmployees() {
    this.loading = true;
    this.employeeService
      .listEmployees(this.page)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        ({ total, list }) => {
          this.employees = list;
          this.totalRecord = total;
        },
        () => {
          this.loading = false;
          this.emptyState = true;
        },
        () => {
          this.emptyState = false;
          this.loading = false;
        }
      );
  }

  handlePageChange({ pageIndex }: { pageIndex: number }) {
    this.page = pageIndex;
    this.listEmployees();
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
    this.employees = this.employeeService.filterEmployee(filter);
    this.hasFilter = !!filter;

    if (!filter) this.listEmployees();
  }

  handleTryAgain() {
    this.emptyState = false;
    this.listEmployees();
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
