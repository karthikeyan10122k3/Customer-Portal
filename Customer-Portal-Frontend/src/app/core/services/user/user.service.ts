import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userNameSubject = new BehaviorSubject<string>("");

  constructor() {}

  getUserName(): Observable<string> {
    return this.userNameSubject.asObservable();
  }

  // Update the username
  setUserName(name: string): void {
    this.userNameSubject.next(name);
  }
}
