import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { UnauthLayoutComponent } from './layouts/unauth-layout/unauth-layout.component';
import { AlertService } from './services/alert/alert.service';
import { UserStore } from './stores/user.store';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    MainLayoutComponent,
    SidenavComponent,
    UnauthLayoutComponent,
  ],
  providers: [
    UserStore
  ]
})
export class AppComponent implements OnDestroy{
  title = 'Product App';
  private readonly alertService = inject(AlertService);
  private readonly userStore = inject(UserStore);

  message = '';
  class = '';
  loggedIn = this.userStore.loggedIn();

  constructor() {
    //this effect with run each time any of the values change and update the UI accordingly
    effect(() => {
      if (localStorage.getItem('loggedIn') === "true") {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    
      this.message = this.alertService.message();
      this.class = this.alertService.class();
    });

  }

  ngOnDestroy(): void {
    localStorage.clear();
  }

  close(){
    this.alertService.close();
  }
  
}
