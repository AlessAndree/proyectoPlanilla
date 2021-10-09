import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObsService } from './obs.service';

@Injectable({
  providedIn: 'root'
})
export class PlanillasService {

  planillas!: Observable<any[]>;
  planillasCollection!: AngularFirestoreCollection<any>;
  subUid: Subscription;

  registros!: Observable<any[]>;
  registrosCollection!: AngularFirestoreCollection<any>;

  constructor(private readonly afs: AngularFirestore, private obsService: ObsService, private router:Router) {
    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getPlanillas();
    });
    if (this.obsService.uid) {
      this.getPlanillas();
    }
  }

  getPlanillas() {
    this.planillasCollection = this.afs.collection<any>('usuarios/' + this.obsService.uid + '/planillas');
    return this.planillas = this.planillasCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getRegistros(idPlanilla: string) {
    if(idPlanilla == undefined) {
      this.registrosCollection = this.afs.collection<any>('usuarios/' + this.obsService.uid + '/planillas');
      return this.registros = this.registrosCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    } else {
      this.registrosCollection = this.afs.collection<any>('usuarios/' + this.obsService.uid + '/planillas/'+idPlanilla+'/registros');
      return this.registros = this.registrosCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    }
  }

  saveRegistro(registro: any, idRegistro?: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = idRegistro || this.afs.createId();
        const data = { id, ...registro };
        let result = await this.registrosCollection.doc(id).set(data);
        // if (idPlanilla) {
        //   this.activateMessage('alert', 'alert alert-success',
        //     'La planilla se editó correctamente.', 'Edición Exitosa');
        // } else {
        //   this.activateMessage('alert', 'alert alert-success',
        //     'La planilla se creó correctamente.', 'Registro Exitoso');
        // }
        // console.log('ESTO PASA EN SAVEPLANILLA', id);
        // this.router.navigate(['planillas', id])

        resolve(result);
      } catch (err: any) {
        // this.activateMessage('alert', 'alert alert-danger',
        //   'La planilla falló al crearse.', 'Error');
        reject(err.message);
      }
    })
  }

  deletePlanilla(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.planillasCollection.doc(id).delete();
        this.activateMessage('alert', 'alert alert-success',
          `La planilla se eliminó correctamente.`, 'Eliminación Exitosa');
        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
          `La planilla falló al eliminarse.`, 'Error');
        reject(err.message);
      }
    })
  }

  deleteRegistro(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.registrosCollection.doc(id).delete();
        this.activateMessage('alert', 'alert alert-success',
          `El Registro se borró correctamente.`, 'Eliminación Exitosa');
        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
          `El Registro falló al eliminarse.`, 'Error');
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

  savePlanilla(planilla: any, idPlanilla?: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = idPlanilla || this.afs.createId();
        const data = { id, ...planilla };
        let result = await this.planillasCollection.doc(id).set(data);
        if (idPlanilla) {
          this.activateMessage('alert', 'alert alert-success',
            'La planilla se editó correctamente.', 'Edición Exitosa');
        } else {
          this.activateMessage('alert', 'alert alert-success',
            'La planilla se creó correctamente.', 'Registro Exitoso');
        }
        // console.log('ESTO PASA EN SAVEPLANILLA', id);
        this.router.navigate(['planillas', id])

        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
          'La planilla falló al crearse.', 'Error');
        reject(err.message);
      }
    })
  }



}
