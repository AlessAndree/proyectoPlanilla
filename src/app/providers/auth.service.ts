import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = null;

  constructor(private _auth: AngularFireAuth, public router: Router) {
    this.stateUser();
  }

  stateUser() {
    console.log('se ejecuta');

    this._auth.onAuthStateChanged((user: any) => {
      // console.log(user)
      if (user) {
        console.log('LOGEADO');
        this.user = user;
        return true;
      } else {
        this.user = null;
        console.log('NO LOEADO');
        return false;
      }
    });
  }

  getUser() {
    return firebase.auth().currentUser;

  }


  loginWithGoogle() {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider);
  }

  loginWithEmailPass(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    firebase.auth().signOut().then((data: any) => {
      console.log(data);
      this.router.navigate(['login']);
    });
  }

  register(email: string, pass: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, pass);
  }

}
