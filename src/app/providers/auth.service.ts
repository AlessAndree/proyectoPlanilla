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
    this._auth.onAuthStateChanged((user:any)=> {
      // console.log(user)
      if(user) {
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


  loginWithGoogle() {
    // this._auth.signInWithPopup(firebase.auth.GoogleAuthProvider)
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider);
    // .then((data: any) => {
    //   console.log('SI SE LOGEA', data);
    // });
  }

  logout() {
    firebase.auth().signOut().then((data: any) => {console.log(data);});
  }

}
