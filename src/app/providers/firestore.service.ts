import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObsService } from './obs.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  puestos!: Observable<any[]>;
  puestosCollection!: AngularFirestoreCollection<any>;
  subUid: Subscription;

  constructor(private readonly afs: AngularFirestore, private obsService: ObsService) {
    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getPuestos();
    });
    if (this.obsService.uid) {
      this.getPuestos();
    }
  }


  deletePuesto(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.puestosCollection.doc(id).delete();
        this.activateMessage('alert', 'alert alert-success',
          'El puesto se borró correctamente.', 'Eliminación Exitosa');
        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
          'El puesto falló al eliminarse.', 'Error');
        reject(err.message);
      }
    })
  }

  activateMessage(tipo: string, clase: string, mensaje: string, titulo: string) {
    const message = {
      type: tipo,
      class: clase,
      message: mensaje,
      titulo: titulo
    }
    this.obsService.openDialogMessage(message);
  }

  savePuesto(puesto: any, idPuesto?: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = idPuesto || this.afs.createId();
        const data = { id, ...puesto };
        let result = await this.puestosCollection.doc(id).set(data);
        if (idPuesto) {
          this.activateMessage('alert', 'alert alert-success',
            'El puesto se editó correctamente.', 'Edición Exitosa');
        } else {
          this.activateMessage('alert', 'alert alert-success',
            'El puesto se guardó correctamente.', 'Registro Exitoso');
        }
        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
          'El puesto falló al guardarse.', 'Error');
        reject(err.message);
      }
    })

  }

  getPuestos() {
    this.puestosCollection = this.afs.collection<any>('usuarios/' + this.obsService.uid + '/puestos');
    return this.puestos = this.puestosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

}
