import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLogged: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    this.isLogged = !!localStorage.getItem('user');
   }

  ngOnInit(): void {
    if(this.isLogged) {
      this.router.navigate(['/']);
    }
  }
  submitForm(form: any) {
    const { email, password } = form.value;
    this.authService.login(email, password);    
  }
}
