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
    console.log('ENTRA AL CONSTRUCTOR DEL SERVICIO PUESTOS');
    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getPuestos();
    });
    if(this.obsService.uid) {
      this.getPuestos();
    }
  }


  deletePuesto(id: string) {
    console.log('entra al servicio a eliminar', id);

    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.puestosCollection.doc(id).delete();
        const message = {
          type: 'alert',
          class: 'alert alert-success',
          message: 'El puesto se borró correctamente.',
          titulo: 'Eliminación Exitosa'
        }
        this.obsService.openDialogMessage(message);
        resolve(result);
      } catch (err: any) {
        const message = {
          type: 'alert',
          class: 'alert alert-danger',
          message: 'El puesto falló al eliminarse.',
          titulo: 'Error'
        }
        this.obsService.openDialogMessage(message);
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
          type: 'alert',
          class: 'alert alert-success',
          message: 'El puesto se guardó correctamente.',
          titulo: 'Registro Exitoso'
        }
        if(idPuesto) {
          message.message = 'El puesto se editó correctamente';
          message.titulo = 'Edición Exitosa';
        }
        // console.log('GUARDA');
        this.obsService.openDialogMessage(message);
        resolve(result);
      } catch (err: any) {
        const message = {
          type: 'alert',
          class: 'alert alert-danger',
          message: 'El puesto falló al guardarse.',
          titulo: 'Error'
        }
        this.obsService.openDialogMessage(message);
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
