import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserStore } from '../../../stores/user.store';
import { AlertService } from '../../../services/alert/alert.service';
import { Login } from '../../../models/login.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit  {
  form!: FormGroup;
  id!: number;
  isAddMode!: boolean;
  loading = false;
  submitted = false;
  user!: User;

  private readonly formBuilder = inject(FormBuilder);
  private readonly userStore = inject(UserStore);
  private readonly alertService = inject(AlertService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.loading = this.userStore.isLoading();

    //create new login object
    const newLogin: Login = {
      email: this.f['email']?.value,
      password: this.f['password']?.value,
    };

    //execute login process
    this.userStore.login(newLogin);
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.close();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.login();
  }



  //getter for form fields
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

}
