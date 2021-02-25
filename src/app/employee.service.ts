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
  id?: number;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
  profile_image?: string;
}
