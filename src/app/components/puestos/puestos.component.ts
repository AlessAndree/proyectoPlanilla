import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/providers/auth.service';
import { FirestoreService } from 'src/app/providers/firestore.service';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class PuestosComponent implements OnInit {

  subMessage: Subscription;
  subUid: Subscription;

  displayedColumns: string[] = ['nombre', 'mensual', 'quincenal', 'diario', 'opciones'];
  dataSource = new MatTableDataSource<any>([]);
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  puestos$ = this.puestosService.puestos;

  constructor(public dialog: MatDialog, private puestosService: FirestoreService, private auth: AuthService) {
    // this.dataSource.paginator = paginator;
    this.subMessage = this.auth.observableMessage$.subscribe((data) => {
      this.auth.openDialog(data);
    });
    this.subUid = this.auth.observableUid$.subscribe(() => {
      this.puestos$ = this.puestosService.puestos;
      this.getPuestos();
    });
    if (this.auth.uid) {
      this.getPuestos()
    }
  }

  ngOnInit(): void {

  }

  getPuestos() {
    this.puestos$.subscribe((data: any) => {
      console.log('PUESTOS', data);
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogPuestosComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(puesto => {
      // console.log(`Dialog result: ${result}`);
      this.puestosService.savePuesto(puesto);
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

  constructor(public dialogRef: MatDialogRef<DialogPuestosComponent>) {
    this.formPuesto = new FormGroup({
      nombrePuesto: new FormControl('', Validators.required),
      salarioMensual: new FormControl(0, [Validators.required, Validators.min(30)]),
      salarioQuincenal: new FormControl(0, [Validators.required, Validators.min(15)]),
      salarioDiario: new FormControl(0, [Validators.required, Validators.min(1)])
    });
  }

  accept() {
    console.log(this.formPuesto);
    const puesto = {
      nombrePuesto: this.formPuesto.get('nombrePuesto')?.value,
      salarioMensual: this.formPuesto.get('salarioMensual')?.value,
      salarioQuincenal: this.formPuesto.get('salarioQuincenal')?.value,
      salarioDiario: this.formPuesto.get('salarioDiario')?.value
    }
    this.dialogRef.close(puesto);
  }

  onNoClick(): void {
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
