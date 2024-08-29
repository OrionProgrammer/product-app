import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {

  logOut() : void{
    localStorage.clear();
  }

}