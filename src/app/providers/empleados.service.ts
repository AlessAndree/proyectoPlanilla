import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObsService } from './obs.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  empleados!: Observable<any[]>;
  empleadosCollection!: AngularFirestoreCollection<any>;
  subUid: Subscription;

  constructor(private readonly afs: AngularFirestore, private obsService: ObsService) {
    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getEmpleados();
    });
    if (this.obsService.uid) {
      this.getEmpleados();
    }
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

  getEmpleados() {
    this.empleadosCollection = this.afs.collection<any>('usuarios/' + this.obsService.uid + '/empleados');
    return this.empleados = this.empleadosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  saveEmpleado(empleado: any, idEmpleado?: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = idEmpleado || this.afs.createId();
        const data = { id, ...empleado };
        let result = await this.empleadosCollection.doc(id).set(data);
        if (idEmpleado) {
          this.activateMessage('alert', 'alert alert-success',
            'El empleado se editó correctamente.', 'Edición Exitosa');
        } else {
          this.activateMessage('alert', 'alert alert-success',
            'El empleado se guardó correctamente.', 'Registro Exitoso');
        }
        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
          'El empleado falló al guardarse.', 'Error');
        reject(err.message);
      }
    })
  }

  deleteEmpleado(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.empleadosCollection.doc(id).delete();
        this.activateMessage('alert', 'alert alert-success',
          'El empleado se borró correctamente.', 'Eliminación Exitosa');
        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
          'El empleado falló al eliminarse.', 'Error');
        reject(err.message);
      }
    })
  }

}
