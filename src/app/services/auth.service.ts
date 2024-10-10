import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afa: AngularFireAuth, private toastr: ToastrService, private router: Router) { }

  login(email: string, pasword: string) {
    this.afa.signInWithEmailAndPassword(email, pasword).then((logRef) => {
      this.afa.authState.subscribe(user => {
        localStorage.setItem('user', JSON.stringify(user));
        setTimeout(() => {
          this.toastr.success('Logged in successfully.');
          this.router.navigate(['/']);
        },1000)
      })
      
      
    }).catch(err => {
      this.toastr.error("Invalid email or password, Please try again!");
    })
  }
  
  logOut() {
    this.afa.signOut().then(() => {
      localStorage.removeItem('user');
      this.toastr.success('Logged out successfully ..!');
      this.router.navigate(['/login']);
    })
  }

  isLoggedIn() {
    return !!localStorage.getItem('user');
  }
}
