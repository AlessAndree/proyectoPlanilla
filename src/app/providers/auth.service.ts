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

  private subjectUid = new Subject<void>();
  public observableUid$ = this.subjectUid.asObservable();

  private subjectMessage = new Subject<void>();
  public observableMessage$ = this.subjectMessage.asObservable();

  ejecutarObservableUid(uid: string) {
    console.log('OBTIENE UID', uid)
    this.uid = uid;
    this.subjectUid.next();
  }

  ejecutarObservableMessage(ms: any) {
    this.subjectMessage.next(ms);
  }

  user: any = null;
  uid: string | undefined;

  constructor(private _auth: AngularFireAuth, public router: Router, public dialog: MatDialog) {
    this.stateUser();
  }

  openDialog(message: any) {
    console.log('ABRE DIALOGO DE MENSAJE');

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '500px',
      data: {message}
    });
  }

  stateUser() {
    console.log('se ejecuta');

    this._auth.onAuthStateChanged((user: any) => {
      if (user) {
        this.user = user;
        this.uid = user.uid;
        return true;
      } else {
        this.user = null;
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
