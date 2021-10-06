import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { AjustesService } from 'src/app/providers/ajustes.service';
import { ObsService } from 'src/app/providers/obs.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent implements OnInit {

  subUid: Subscription;
  subMessage: Subscription;

  displayedColumns: string[] = ['descripcion', 'tipoAjuste', 'estado', 'definicionAjuste', 'opciones'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ajustes$: Observable<any[]> | any;

  constructor(public dialog: MatDialog, private obsService: ObsService, private ajustesService: AjustesService) {
    this.dataSource.paginator = this.paginator;

    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getListaAjustes();
    });
    this.subMessage = this.obsService.observableMessage$.subscribe((id) => {
      this.ajustesService.deleteAjuste(String(id));
    })

    if (this.obsService.uid) {
      this.getListaAjustes();
    }
  }

  ngOnInit(): void {
  }

  deleteP(id: string, tipoAjuste: string) {
    const message = {
      type: 'delete',
      class: 'alert alert-light',
      message: `¿Desea eliminar este ${tipoAjuste}?`,
      titulo: 'Eliminar'
    }
    this.obsService.openDialogMessage(message, id);
  }

  openDialog(ajuste?: any, opcion?: string) {
    let dialogRef;
    if (ajuste) {
      dialogRef = this.dialog.open(DialogAjustesComponent, {
        width: '800px', data: { ajuste, opcion }
      });
    } else {
      dialogRef = this.dialog.open(DialogAjustesComponent, {
        width: '800px'
      });
    }
    dialogRef.afterClosed().subscribe(info => {
      // console.log(`Dialog result: ${result}`);
      if (info) {
        if (ajuste) {
          this.ajustesService.saveAjuste(info, info.tipoAjuste, ajuste.id);
        } else {
          this.ajustesService.saveAjuste(info, info.tipoAjuste);
        }
      }
    });
  }

  getListaAjustes() {
    setTimeout(() => {
      this.ajustes$ = this.ajustesService.ajustes;
      this.ajustes$.subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
      });
    }, 300);
  }

}

@Component({
  selector: 'app-dialog-ajustes',
  templateUrl: 'dialog-ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class DialogAjustesComponent {



  formAjuste: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DialogAjustesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      const ajuste = data.ajuste;
      let habilitar = !true;
      if(data.opcion == 'ver') {
        habilitar = !false;
      } else {
        habilitar = !true;
      }
      this.formAjuste = this.fb.group({
        descripcion: [{value: ajuste.descripcion, disabled: habilitar}, Validators.required,],
        tipoAjuste: [{value: ajuste.tipoAjuste, disabled: habilitar}, Validators.required,],
        aplicaTodos: [{value: ajuste.aplicaTodos, disabled: habilitar}, Validators.required,],
        efectuarAjuste: [{value: ajuste.efectuarAjuste, disabled: habilitar}, Validators.required,],
        estado: [{value: ajuste.estado, disabled: habilitar}, Validators.required,]
      });


      if (ajuste.definicionAjuste) {
        this.formAjuste.addControl('definicionAjuste', new FormControl({value:ajuste.definicionAjuste, disabled: habilitar}, [Validators.required]))
      }
      if (ajuste.porcentaje) {
        this.formAjuste.addControl('porcentaje', new FormControl({value:ajuste.porcentaje, disabled: habilitar}, [Validators.required, Validators.min(0), Validators.max(100)]))
      }
      if (ajuste.tipoCantidad) {
        this.formAjuste.addControl('tipoCantidad', new FormControl({value:ajuste.tipoCantidad, disabled: habilitar}, [Validators.required]))
      }
      if (ajuste.cantidad) {
        this.formAjuste.addControl('cantidad', new FormControl({value:ajuste.cantidad, disabled: habilitar}, [Validators.required, Validators.min(0)]))
      }
      if(ajuste.tipoAjuste == 'Bono') {
        if (ajuste.afectoDescuentos != undefined && ajuste.afectoDescuentos != null) {
          this.formAjuste.addControl('afectoDescuentos', new FormControl({value:ajuste.afectoDescuentos, disabled: habilitar}, [Validators.required]))
        }
        if (ajuste.totalProporcionalDiasLab != undefined && ajuste.totalProporcionalDiasLab != null) {
          this.formAjuste.addControl('totalProporcionalDiasLab', new FormControl({value:ajuste.totalProporcionalDiasLab, disabled: habilitar}, [Validators.required]))
        }
      }




    } else {
      this.formAjuste = this.fb.group({
        descripcion: ['', Validators.required],
        tipoAjuste: ['', Validators.required],
        aplicaTodos: ['', Validators.required],
        efectuarAjuste: ['', Validators.required],
        estado: [true, Validators.required]
      });
    }
  }

  accept() {
    this.dialogRef.close(this.formAjuste.value);
  }

  selectTipoAjuste() {
    const ajuste = this.formAjuste.get('tipoAjuste')?.value;
    if (ajuste) {
      this.formAjuste.addControl('definicionAjuste', new FormControl('', Validators.required));
      if (ajuste == 'Bono') {
        this.formAjuste.addControl('afectoDescuentos', new FormControl(null, Validators.required));
        this.formAjuste.addControl('totalProporcionalDiasLab', new FormControl(null, Validators.required));
      } else if (ajuste == 'Descuento') {
        this.formAjuste.removeControl('afectoDescuentos');
        this.formAjuste.removeControl('totalProporcionalDiasLab');
      }
    }
  }

  selectDefinicionAjuste() {
    const definicion = this.formAjuste.get('definicionAjuste')?.value;
    if (definicion == 'Porcentaje') {
      this.formAjuste.removeControl('tipoCantidad');
      this.formAjuste.removeControl('cantidad');
      this.formAjuste.addControl('porcentaje', new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]));
    } else if (definicion == 'Cantidad') {
      this.formAjuste.removeControl('porcentaje');
      this.formAjuste.addControl('tipoCantidad', new FormControl('', [Validators.required]));
    }
  }

  selectTipoCantidad() {
    const tipoCantidad = this.formAjuste.get('tipoCantidad')?.value;
    if (tipoCantidad == 'Fija') {
      this.formAjuste.removeControl('cantidad');
      this.formAjuste.addControl('cantidad', new FormControl(0, [Validators.required, Validators.min(0)]));
    } else if (tipoCantidad == 'Variable') {
      this.formAjuste.removeControl('cantidad');
      this.formAjuste.addControl('cantidad', new FormControl(0));
      // this.formAjuste.removeControl('cantidad');
    }
  }

}
