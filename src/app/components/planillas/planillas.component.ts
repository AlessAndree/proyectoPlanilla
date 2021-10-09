import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { ObsService } from 'src/app/providers/obs.service';
import { PlanillasService } from 'src/app/providers/planillas.service';
import { DialogPlanillaComponent } from './dialog-planilla/dialog-planilla.component';

@Component({
  selector: 'app-planillas',
  templateUrl: './planillas.component.html',
  styleUrls: ['./planillas.component.css']
})
export class PlanillasComponent implements OnInit, OnDestroy{

  subUid: Subscription;
  subMessage: Subscription;

  displayedColumns: string[] = ['descripcionPlanilla', 'tipoPlanilla', 'fechaPlanilla', 'opciones'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  planillas$: Observable<any[]> | any;

  constructor(public dialog: MatDialog, public planillaService: PlanillasService, private obsService: ObsService) {

    this.dataSource.paginator = this.paginator;

    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getListaPlanillas();
    });
    this.subMessage = this.obsService.observableMessage$.subscribe((id) => {
      // console.log('ENTRA ACÁ EN SUBMENSAJE PLANILLA');

      this.planillaService.deletePlanilla(String(id));
    });

    if (this.obsService.uid) {
      this.getListaPlanillas();
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subUid.unsubscribe();
    this.subMessage.unsubscribe();
  }

  openDialog(planilla?: any) {
    let dialogRef;
    if (planilla) {
      dialogRef = this.dialog.open(DialogPlanillaComponent, {
        width: '700px', data: { planilla }
      });
    } else {
      dialogRef = this.dialog.open(DialogPlanillaComponent, {
        width: '700px'
      });
    }
    dialogRef.afterClosed().subscribe(info => {
      // console.log(`Dialog result: ${result}`);
      if (info) {
        // console.log('ESTA ES LA INFO', info)
        if (planilla) {
          // this.ajustesService.saveAjuste(info, info.tipoAjuste, ajuste.id);
        } else {
          this.planillaService.savePlanilla(info);
        }
      }
    });
  }

  deleteP(id: string) {
    console.log('CLICK EN EL METODO DELETEP')
    const message = {
      type: 'delete',
      class: 'alert alert-light',
      message: '¿Desea eliminar esta Planilla?',
      titulo: 'Eliminar'
    }
    this.obsService.openDialogMessage(message, id);
  }

  getListaPlanillas() {
    setTimeout(() => {
      this.planillas$ = this.planillaService.planillas;
      this.planillas$.subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
      });
    }, 300);
  }

}
