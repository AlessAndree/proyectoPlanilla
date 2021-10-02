import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/providers/auth.service';
import { FirestoreService } from 'src/app/providers/firestore.service';
import { ObsService } from 'src/app/providers/obs.service';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class PuestosComponent implements OnInit, OnDestroy {

  subUid: Subscription;
  subMessage: Subscription;

  displayedColumns: string[] = ['nombre', 'mensual', 'quincenal', 'diario', 'opciones'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  puestos$: Observable<any[]> | any;

  constructor(public dialog: MatDialog, private puestosService: FirestoreService, private obsService: ObsService) {

    this.dataSource.paginator = this.paginator;

    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getListaPuestos();
    });
    this.subMessage = this.obsService.observableMessage$.subscribe((id) => {
      console.log('entra al observable para eliminar', id);

      this.puestosService.deletePuesto(String(id));
    })

    if (this.obsService.uid) {
      this.getListaPuestos();
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    console.log('SE DESTRUYE EL COMPONENTE DE PUESTOS');
    this.subUid.unsubscribe();
    this.puestos$ = null;
  }

  getListaPuestos() {
    console.log('ENTRA A getListaPuestos');
    setTimeout(() => {
      this.puestos$ = this.puestosService.puestos;
      this.puestos$.subscribe((data: any) => {
        console.log('ESTOS SON LOS PUESTOS', data);
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
      });
    }, 300);
  }

  deleteP(id: string) {
    const message = {
      type: 'delete',
      class: 'alert alert-light',
      message: '¿Desea eliminar este puesto?',
      titulo: 'Eliminar'
    }
    this.obsService.openDialogMessage(message, id);
  }

  openDialog(puesto?: any) {
    let dialogRef;
    if (puesto) {
      dialogRef = this.dialog.open(DialogPuestosComponent, {
        width: '700px',
        data: { puesto }
      });
    } else {
      dialogRef = this.dialog.open(DialogPuestosComponent, {
        width: '700px'
      });
    }
    dialogRef.afterClosed().subscribe(info => {
      // console.log(`Dialog result: ${result}`);
      if (info) {
        if(puesto) {
          this.puestosService.savePuesto(info, puesto.id);
        } else {
          this.puestosService.savePuesto(info);
        }
      }
    });
  }

}

@Component({
  selector: 'app-dialog-puestos',
  templateUrl: 'dialog-puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class DialogPuestosComponent {

  formPuesto: FormGroup;
  error: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogPuestosComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    if (data) {
      console.log(data);
      this.formPuesto = new FormGroup({
        nombrePuesto: new FormControl(data.puesto.nombrePuesto, Validators.required),
        salarioMensual: new FormControl(data.puesto.salarioMensual, [Validators.required, Validators.min(30)]),
        salarioQuincenal: new FormControl(data.puesto.salarioQuincenal, [Validators.required, Validators.min(15)]),
        salarioDiario: new FormControl(data.puesto.salarioDiario, [Validators.required, Validators.min(1)])
      });
    } else {
      this.formPuesto = new FormGroup({
        nombrePuesto: new FormControl('', Validators.required),
        salarioMensual: new FormControl(0, [Validators.required, Validators.min(30)]),
        salarioQuincenal: new FormControl(0, [Validators.required, Validators.min(15)]),
        salarioDiario: new FormControl(0, [Validators.required, Validators.min(1)])
      });
    }

  }

  accept() {
    console.log('BOTON ACEPTAR', this.formPuesto);
    const puesto = {
      nombrePuesto: this.formPuesto.get('nombrePuesto')?.value,
      salarioMensual: this.formPuesto.get('salarioMensual')?.value,
      salarioQuincenal: this.formPuesto.get('salarioQuincenal')?.value,
      salarioDiario: this.formPuesto.get('salarioDiario')?.value
    }
    this.dialogRef.close(puesto);
  }

  onNoClick(): void {
    console.log('BOTON CANCELAR')
    this.dialogRef.close();
  }

  calcularSalarios(op: string) {
    if (op == 'mensual') {
      const mensual = this.formPuesto.get('salarioMensual')?.value;
      if (mensual < 30) {
        this.error = true;
        return;
      }
      this.formPuesto.get('salarioMensual')?.setValue((mensual).toFixed(2));
      this.formPuesto.get('salarioQuincenal')?.setValue((mensual / 2).toFixed(2));
      this.formPuesto.get('salarioDiario')?.setValue((mensual / 30).toFixed(2));
    } else if (op == 'quincenal') {
      const quincenal = this.formPuesto.get('salarioQuincenal')?.value;
      if (quincenal < 15) {
        this.error = true;
        return;
      }
      this.formPuesto.get('salarioMensual')?.setValue((quincenal * 2).toFixed(2));
      this.formPuesto.get('salarioQuincenal')?.setValue((quincenal).toFixed(2));
      this.formPuesto.get('salarioDiario')?.setValue((quincenal / 15).toFixed(2));
    } else if (op == 'diario') {
      const diario = this.formPuesto.get('salarioDiario')?.value;
      if (diario < 1) {
        this.error = true;
        return;
      }
      this.formPuesto.get('salarioMensual')?.setValue((diario * 30).toFixed(2));
      this.formPuesto.get('salarioQuincenal')?.setValue((diario * 15).toFixed(2));
      this.formPuesto.get('salarioDiario')?.setValue((diario).toFixed(2));
    }
  }

}
