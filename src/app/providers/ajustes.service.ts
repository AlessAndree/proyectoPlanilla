import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObsService } from './obs.service';

@Injectable({
  providedIn: 'root'
})
export class AjustesService {

  ajustes!: Observable<any[]>;
  ajustesCollection!: AngularFirestoreCollection<any>;
  subUid: Subscription;

  constructor(private readonly afs: AngularFirestore, private obsService: ObsService) {
    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getAjustes();
    });
    if (this.obsService.uid) {
      this.getAjustes();
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

  getAjustes() {
    this.ajustesCollection = this.afs.collection<any>('usuarios/' + this.obsService.uid + '/ajustes');
    return this.ajustes = this.ajustesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  saveAjuste(ajuste: any, tipoAjuste: string, idAjuste?: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = idAjuste || this.afs.createId();
        const data = { id, ...ajuste };
        let result = await this.ajustesCollection.doc(id).set(data);
        if (idAjuste) {
          this.activateMessage('alert', 'alert alert-success',
            `El ${tipoAjuste} se editó correctamente.`, 'Edición Exitosa');
        } else {
          this.activateMessage('alert', 'alert alert-success',
            `El ${tipoAjuste} se guardó correctamente.`, 'Registro Exitoso');
        }
        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
        `El ${tipoAjuste} falló al guardarse.`, 'Error');
        reject(err.message);
      }
    })
  }

  deleteAjuste(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.ajustesCollection.doc(id).delete();
        this.activateMessage('alert', 'alert alert-success',
          `El ajuste se borró correctamente.`, 'Eliminación Exitosa');
        resolve(result);
      } catch (err: any) {
        this.activateMessage('alert', 'alert alert-danger',
          `El ajuste falló al eliminarse.`, 'Error');
        reject(err.message);
      }
    })
  }

}
