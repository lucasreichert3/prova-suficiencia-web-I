import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  SERVICE_URL = 'http://dummy.restapiexample.com/api/v1';
  constructor(private http: HttpClient) {}

  listEmployees(
    page = 0,
    size = 10
  ): Observable<{ list: Employee[]; total: number }> {
    const storageEmplyees = localStorage.getItem('employees');

    return !storageEmplyees
      ? this.loadEmployees()
      : of(this.listEmployeesWithPaginator(page, size));
  }

  getEmployee(id: string): Observable<Employee> {
    const storageEmplyees = localStorage.getItem('employees');

    return !storageEmplyees
      ? this.loadEmployee(id)
      : this.findEmployeeLocalStorage(id);
  }

  saveEmployee(data: Employee): Observable<Employee> {
    const storageEmplyees = localStorage.getItem('employees');

    return !storageEmplyees
      ? this.saveNewEmployeeRequest(data)
      : this.saveEmployeeOnStorage(data);
  }

  updateEmployee(data: Employee): Observable<Employee> {
    const storageEmplyees = localStorage.getItem('employees');

    return !storageEmplyees
      ? this.updateEmployeeRequest(data)
      : this.updateEmployeeOnStorage(data);
  }

  deleteEmployee(id: number): Observable<void> {
    const employeesStorage: Employee[] = JSON.parse(
      localStorage.getItem('employees')
    );

    return !employeesStorage
      ? this.deleteEmployeeRequest(id)
      : of(this.deleteEmployeeOnStorage(id));
  }

  filterEmployee(filter: string) {
    const employeesStorage: Employee[] = JSON.parse(
      localStorage.getItem('employees')
    );
    return employeesStorage.filter(
      ({ employee_name, id }) =>
        employee_name.startsWith(filter) || id.toString() === filter
    );
  }

  private listEmployeesWithPaginator(
    page = 0,
    size = 10
  ): { total: number; list: Employee[] } {
    const storageEmplyees: Employee[] = JSON.parse(
      localStorage.getItem('employees')
    );
    let start = 0;
    let end = 10;
    if (page > 0) {
      start = page / 0.1;
      end = size + start;
    }
    return {
      list: storageEmplyees.slice(start, end),
      total: storageEmplyees.length,
    };
  }

  private deleteEmployeeOnStorage(id: number): void {
    const employeesStorage: Employee[] = JSON.parse(
      localStorage.getItem('employees')
    );

    const updatedEmployees = employeesStorage.filter(
      ({ id: employeeId }) => employeeId !== id
    );

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    return;
  }

  private deleteEmployeeRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.SERVICE_URL}/delete/${id}`);
  }

  private saveNewEmployeeRequest(data: Employee): Observable<Employee> {
    return this.http
      .post<{ data: Employee; status: string }>(
        `${this.SERVICE_URL}/create`,
        data
      )
      .pipe(map(({ data }) => data));
  }

  private updateEmployeeOnStorage({
    id,
    employee_name,
    employee_age,
    employee_salary,
  }: Employee) {
    const employeesStorage: Employee[] = JSON.parse(
      localStorage.getItem('employees')
    );
    const updatedEmployees = employeesStorage.map((currentEmployee) => {
      if (id === currentEmployee.id) {
        currentEmployee = {
          ...currentEmployee,
          employee_name,
          employee_age,
          employee_salary,
        };
      }

      return currentEmployee;
    });

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    return of({
      id,
      employee_name,
      employee_age,
      employee_salary,
    });
  }

  private updateEmployeeRequest(data: Employee): Observable<Employee> {
    return this.http
      .put<{ data: Employee; status: string }>(
        `${this.SERVICE_URL}/update/${data.id}`,
        data
      )
      .pipe(map(({ data }) => data));
  }

  private saveEmployeeOnStorage({
    employee_name,
    employee_age,
    employee_salary,
  }: Employee) {
    const employeesStorage: Employee[] = JSON.parse(
      localStorage.getItem('employees')
    );
    const newEmployee = {
      id: employeesStorage.length + 1,
      employee_name,
      employee_age,
      employee_salary,
    };
    const employees: Employee[] = [...employeesStorage, newEmployee];
    localStorage.setItem('employees', JSON.stringify(employees));
    return of(newEmployee);
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

  private loadEmployees(): Observable<{ list: Employee[]; total: number }> {
    return this.http
      .get<{ status: string; data: Employee[] }>(
        `${this.SERVICE_URL}/employees`
      )
      .pipe(
        map(({ data }) => {
          localStorage.setItem('employees', JSON.stringify(data));
          return { list: data.slice(0, 10), total: data.length };
        })
      );
  }
}

export interface Employee {
  id?: number;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
  profile_image?: string;
}
