import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
user: any;
  username: any;

  isLoggedIn: boolean = false;
  constructor(private authService: AuthService) { 
     this.user = localStorage.getItem('user');
  }
  
  ngOnInit(): void {
    if (this.user) {
      this.username = JSON.parse(this.user).email;
      this.isLoggedIn = true;
    }
  }

  onLogout() {
    this.isLoggedIn = false;
    this.authService.logOut();
  }
}
