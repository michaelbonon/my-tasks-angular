import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { List } from '../my-tasks/list'
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { SessionService } from './session.service';

const baseUrl = 'http://localhost:8080/api/users';

@Injectable()
export class ListService {

  lists: List[] = [];
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private sessionService: SessionService
  ) { }

  create(data: List): Observable<any> {
    const userId = this.sessionService.getUser().id;
    return this.http.post(`${baseUrl}/${userId}/lists`, data, { headers: this.auth.getAuthHeader()});
  }  

  getLists(): void {
    const userId = this.sessionService.getUser().id;
    this.isLoading = true;
    this.http.get<List[]>(`${baseUrl}/${userId}/lists`, { headers: this.auth.getAuthHeader()})
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        lists => {
          this.lists = lists;
        },
        error => {
          console.log(error);
          this.snackBar.open('An error occured while retrieving the lists. Please try again later.', null, {duration: 4000});
        }
      );
  }

  getList(id: string): Observable<List> {
    const userId = this.sessionService.getUser().id;
    return this.http.get<List>(`${baseUrl}/${userId}/lists/${id}`, { headers: this.auth.getAuthHeader() });
  }

}
