import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Hello {
  private apiUrl = 'http://localhost:8080/api/hello'; // Spring Boot backend

  constructor(private http: HttpClient) {}

  getMessage(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}
