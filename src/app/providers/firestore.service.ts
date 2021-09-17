import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  puestos: Observable<any[]>;
  puestosCollection: AngularFirestoreCollection<any>;
  subUid: Subscription;

  constructor(private readonly afs: AngularFirestore, private auth: AuthService) {
    this.subUid = this.auth.observableUid$.subscribe(() => {
      this.inicia();
      console.log('ENTRA AL OBSERVAVLE');
    });
    this.puestosCollection = this.afs.collection<any>('usuarios/' + this.auth.uid + '/puestos');
    this.puestos = this.puestosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as any))
    );
    this.getPuestos();
  }

  inicia() {
    this.puestosCollection = this.afs.collection<any>('usuarios/' + this.auth.uid + '/puestos');
    this.puestos = this.puestosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as any))
    );
  }

  deletePuesto(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.puestosCollection.doc(id).delete();
        resolve(result);
      } catch (err: any) {
        reject(err.message);
      }
    })
  }

  savePuesto(puesto: any, idPuesto?: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = idPuesto || this.afs.createId();
        const data = { id, ...puesto };
        let result = await this.puestosCollection.doc(id).set(data);
        const message = {
          class: 'alert alert-success',
          message: 'El puesto se guardó correctamente.',
          titulo: 'Registro Exitoso'
        }
        this.auth.ejecutarObservableMessage(message);
        console.log('GUARDA');
        resolve(result);
      } catch (err: any) {
        const message = {
          class: 'alert alert-danger',
          message: 'El puesto falló al guardarse.',
          titulo: 'Registro Fallido'
        }
        this.auth.ejecutarObservableMessage(message);
        reject(err.message);
      }
    })

  }

  getPuestos() {
    this.puestos = this.puestosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as any))
    );
  }

}
