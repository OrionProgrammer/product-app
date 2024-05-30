import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { User } from '../../../models/user.model';
import { AlertService } from '../../../services/alert/alert.service';
import { UserStore } from '../../../stores/user.store';
import { CommonModule } from '@angular/common';
import Validation from '../../business-rules/validation';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
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
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: [
        '',
        [Validators.required],
      ],
    },
    {
      validators: [Validation.match('password', 'confirmPassword')]
    });
  }

  //create new customer
  register() {
    this.loading = this.userStore.isLoading();

    //create new user object
    const newUser: User = {
      id: 0,
      name: this.f['name']?.value,
      surname: this.f['surname']?.value,
      email: this.f['email']?.value,
      password: this.f['password']?.value,
      token: '',
    };

    //execute register process
    this.userStore.register(newUser);
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.close();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.register();
  }

  //getter for form fields
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

}
