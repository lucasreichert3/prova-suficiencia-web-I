import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  SERVICE_URL = '	http://dummy.restapiexample.com/api/v1';
  constructor(private http: HttpClient) {}

  listEmployees(): Observable<Employee[]> {
    const storageEmplyees = localStorage.getItem('employees');

    return !storageEmplyees
      ? this.loadEmployees()
      : of(JSON.parse(storageEmplyees));
  }

  getEmployee(id: string): Observable<Employee> {
    const storageEmplyees = localStorage.getItem('employees');

    return !storageEmplyees
      ? this.loadEmployee(id)
      : this.findEmployeeLocalStorage(id);
  }

  private findEmployeeLocalStorage(employeeId: string): Observable<Employee> {
    const employees: Employee[] = JSON.parse(localStorage.getItem('employees'));

    const employee = employees.find(({ id }) => parseInt(employeeId) === id);

    return !employees ? this.loadEmployee(employeeId) : of(employee);
  }

  private loadEmployee(id: string): Observable<Employee> {
    return this.http
      .get<{ status: string; data: Employee }>(
        `${this.SERVICE_URL}/employees/${id}`
      )
      .pipe(map(({ data }) => data));
  }

  private loadEmployees(): Observable<Employee[]> {
    return this.http
      .get<{ status: string; data: Employee[] }>(
        `${this.SERVICE_URL}/employees`
      )
      .pipe(
        map(({ data }) => {
          localStorage.setItem('employees', JSON.stringify(data));
          return data;
        })
      );
  }
}

export interface Employee {
  id: number;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
  profile_image: string;
}
