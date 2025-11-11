import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, CreateUserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/utilisateur`;

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(userDto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userDto);
  }

  login(login: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { login, password });
  }
}
