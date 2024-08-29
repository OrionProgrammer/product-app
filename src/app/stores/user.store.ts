import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { UserService } from '../services/user/user.service';
import { AlertService } from '../services/alert/alert.service';
import { AlertType } from '../models/alert.enum';
import { Router } from '@angular/router';

type UserState = {
  user: User;
  isLoading: boolean;
  error: string;
  loggedIn: boolean;
};

const emptyUser = (): User => ({
  id: 0,
  name: '',
  surname: '',
  email: '',
  password: '',
  token: '',
});

const initialState: UserState = {
  user: emptyUser(),
  error: '',
  isLoading: false,
  loggedIn: false,
};

export const UserStore = signalStore(
  withState(initialState),
  withMethods((store, 
    userService = inject(UserService), 
    alertService = inject(AlertService),
    router = inject(Router)) => ({
    updateLogin(value: boolean) {
      patchState(store, { loggedIn: value });
    },
    login: rxMethod<Login> (
        pipe(
          tap(() =>patchState(store, { isLoading: true })),
          switchMap((model) => {
            return userService.login(model).pipe(
              tapResponse({
                next: (user: User) => {
                  patchState(store, { user, loggedIn: true })
                  localStorage.setItem('loggedIn', "true"); //dirty way to save loggedin just for AuthGaurd to work properly. no time to fix
                  localStorage.setItem('token', user.token); //same for jwt interceptor class
                  
                  router.navigate(['dashboard'])
                    .then(() => {
                      window.location.reload();
                    });
                },
                error: (error: any) => { 
                  patchState(store, { error: error, loggedIn: false})
                  localStorage.setItem('loggedIn', "false");
                  alertService.showAlert('Login failed! Please try again.', AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      register: rxMethod<User>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((model) => {
            return userService.register(model).pipe(
              tapResponse({
                next: (user: User) => {
                  patchState(store, { user }); // Update state with user on success
                  alertService.showAlert('Registration successful! Click on Login below to login', AlertType.Success);
                },
                error: (error: any) => {
                  patchState(store, { error: error }); // Update state with error
                  alertService.showAlert('An error occured processing your registration: ' + error.message + ' Please try again', AlertType.Error);
                },
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
  }))
);
