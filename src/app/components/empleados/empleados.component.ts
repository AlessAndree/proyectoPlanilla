import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { EmpleadosService } from 'src/app/providers/empleados.service';
import { FirestoreService } from 'src/app/providers/firestore.service';
import { ObsService } from 'src/app/providers/obs.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit, OnDestroy {

  subUid: Subscription;
  subMessage: Subscription;

  displayedColumns: string[] = ['nombreCompleto', 'ubicacion', 'dpi', 'fechaNacimiento', 'fechaContrato', 'banco', 'noCuenta', 'puesto', 'opciones'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  empleados$: Observable<any[]> | any;

  constructor(public dialog: MatDialog, private obsService: ObsService, private empleadosService: EmpleadosService) {
    this.dataSource.paginator = this.paginator;

    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getListaEmpleados();
    });
    this.subMessage = this.obsService.observableMessage$.subscribe((id) => {
      this.empleadosService.deleteEmpleado(String(id));
    })

    if (this.obsService.uid) {
      this.getListaEmpleados();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subUid.unsubscribe();
    this.empleados$ = null;
  }

  getListaEmpleados() {
    setTimeout(() => {
      this.empleados$ = this.empleadosService.empleados;
      this.empleados$.subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
      });
    }, 300);
  }

  openDialog(empleado?: any) {
    let dialogRef;
    if (empleado) {
      dialogRef = this.dialog.open(DialogEmpleadosComponent, {
        width: '800px', data: { empleado }
      });
    } else {
      dialogRef = this.dialog.open(DialogEmpleadosComponent, {
        width: '800px'
      });
    }
    dialogRef.afterClosed().subscribe(info => {
      // console.log(`Dialog result: ${result}`);
      if (info) {
        if(empleado) {
          this.empleadosService.saveEmpleado(info, empleado.id);
        } else {
          this.empleadosService.saveEmpleado(info);
        }
      }
    });
  }

  deleteP(id: string) {
    const message = {
      type: 'delete',
      class: 'alert alert-light',
      message: '¿Desea eliminar este empleado?',
      titulo: 'Eliminar'
    }
    this.obsService.openDialogMessage(message, id);
  }
}


@Component({
  selector: 'app-dialog-empleados',
  templateUrl: 'dialog-empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class DialogEmpleadosComponent {

  formEmpleado: FormGroup;
  error: boolean = false;
  listPuestos:any[] = [];

  puestos$: Observable<any[]> | any;

  constructor(public dialogRef: MatDialogRef<DialogEmpleadosComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dateAdapter: DateAdapter<Date>, private puestosService: FirestoreService) {
    this.dateAdapter.setLocale('es');
    if (data) {
      this.formEmpleado = new FormGroup({
        nombreCompleto: new FormControl(data.empleado.nombreCompleto, Validators.required),
        ubicacion: new FormControl(data.empleado.ubicacion, Validators.required),
        dpi: new FormControl(data.empleado.dpi, [Validators.required, Validators.minLength(13)]),
        fechaNacimiento: new FormControl(data.empleado.fechaNacimiento.toDate(), Validators.required),
        fechaContrato: new FormControl(data.empleado.fechaContrato.toDate(), Validators.required),
        banco: new FormControl(data.empleado.banco),
        noCuenta: new FormControl(data.empleado.noCuenta),
        puestoRef: new FormControl(data.empleado.puestoRef, Validators.required),
        puesto: new FormControl(data.empleado.puesto)
      });


    } else {
      this.formEmpleado = new FormGroup({
        nombreCompleto: new FormControl('', Validators.required),
        ubicacion: new FormControl('', Validators.required),
        dpi: new FormControl('', [Validators.required, Validators.minLength(13)]),
        fechaNacimiento: new FormControl('', Validators.required),
        fechaContrato: new FormControl('', Validators.required),
        banco: new FormControl(''),
        noCuenta: new FormControl(''),
        puestoRef: new FormControl('', Validators.required),
        puesto: new FormControl(null)
      });
    }
    this.getListaPuestos();
  }

  getListaPuestos() {
    setTimeout(() => {
      this.puestos$ = this.puestosService.puestos;
      this.puestos$.subscribe((data: any) => {
        this.listPuestos = data;

      });
    }, 300);
  }

  accept(){
    const puesto = this.listPuestos.find(puesto => puesto.id === this.formEmpleado.get('puestoRef')?.value);
    this.formEmpleado.get('puesto')?.setValue(puesto);
    this.dialogRef.close(this.formEmpleado.value);
  }

}

