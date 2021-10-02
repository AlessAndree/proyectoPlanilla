import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../components/message-dialog/message-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = null;

  constructor(private _auth: AngularFireAuth, public router: Router, public dialog: MatDialog) {
    this._auth.onAuthStateChanged((user: any) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }


  // ejecutarObservableMessage(ms: any) {
  //   this.subjectMessage.next(ms);
  // }



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
