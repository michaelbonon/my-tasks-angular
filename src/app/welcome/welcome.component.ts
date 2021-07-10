import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fade } from 'src/app/utilities/animations';
import { AuthService, User } from '../services/auth.service';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  animations: [fade]
})
export class WelcomeComponent implements OnInit {

  createListForm: FormGroup;
  listNameFormCtrl = new FormControl('Default');
  user: User;
  isSaving: boolean;

  constructor(
    private auth: AuthService,
    private listService: ListService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.createListForm = new FormGroup({
      'listName': this.listNameFormCtrl
    });
    this.user = this.auth.getUser();
  }

  onSubmit(): void {
    const data = { name: this.listNameFormCtrl.value, owner: this.user.id, isDefault: true };
    this.isSaving = true;
    this.listService
      .create(data)
      .subscribe(
        response => {
          // @todo: prevent user from going back to welcome page by manuualy entering url
          console.log(response);
          this.snackBar.open('Time to get to work...', null, { duration: 2000 }); // move duration into constant in a shared class
          this.router.navigate(['/my-tasks'])
        },
        (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.snackBar.open('An error occured while adding the task. Please try again later.', null, { duration: 4000 }); // move duration into constant in a shared class
          console.log(error);
        }
      );
  }

}
