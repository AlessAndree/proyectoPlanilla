import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MessageDialogComponent } from '../components/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ObsService {

  private subjectUid = new Subject<void>();
  public observableUid$ = this.subjectUid.asObservable();

  private subjectMessage = new Subject<void>();
  public observableMessage$ = this.subjectMessage.asObservable();

  uid: any;

  constructor(public dialog: MatDialog) { }

  ejecutarObservableUid(uid: any) {
    console.log('EJECUTA ejecutarObservableUid', uid);
    this.uid = uid;
    this.subjectUid.next();
  }

  openDialogMessage(message: any, id?: any) {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '500px',
      data: { message }
    });
    dialogRef.afterClosed().subscribe(info => {
      // console.log(`Dialog result: ${result}`);
      if (info) {
        if(id) {
          console.log('ENTRA A DESPUES DE CERRAR,', id);

          this.subjectMessage.next(id);
          // this.puestosService.savePuesto(info, puesto.id);
        }
      }
    });
  }


}
