import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { AjustesService } from 'src/app/providers/ajustes.service';
import { EmpleadosService } from 'src/app/providers/empleados.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-dialog-planilla',
  templateUrl: './dialog-planilla.component.html',
  styleUrls: ['../planillas.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DialogPlanillaComponent implements OnInit {

  ajustes = [];
  empleados = [];
  obtieneAjustes = false;
  obtieneEmpleados = false;

  // date = new FormControl(moment());

  formPlanilla: FormGroup;

  constructor(
    private fb: FormBuilder, private dateAdapter: DateAdapter<Date>, public dialogRef: MatDialogRef<DialogPlanillaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private ajustesService: AjustesService, private empleadosService: EmpleadosService
  ) {
    this.getAjustes();
    this.getEmpleados();
    this.dateAdapter.setLocale('es');
    this.formPlanilla = this.fb.group({
      descripcionPlanilla: ['', Validators.required],
      tipoPlanilla: ['', Validators.required],
      fechaPlanilla: [moment(), Validators.required]
    });
  }

  ngOnInit(): void {
  }

  getAjustes() {
    this.ajustesService.ajustes.subscribe((data: any) => {
      this.ajustes = data;
      this.obtieneAjustes = true;
    });
  }

  getEmpleados() {
    this.empleadosService.empleados.subscribe((data: any) => {
      this.empleados = data;
      this.obtieneEmpleados = true;
    });
  }

  async accept() {
    const fechaPlanilla = new Date(this.formPlanilla.get('fechaPlanilla')?.value);
    const planilla = {
      descripcionPlanilla: this.formPlanilla.get('descripcionPlanilla')?.value,
      tipoPlanilla: this.formPlanilla.get('tipoPlanilla')?.value,
      fechaPlanilla,
      ajustes: JSON.stringify(this.ajustes),
      empleados: JSON.stringify(this.empleados)
    }
    this.dialogRef.close(planilla);
  }

  chosenYearHandler(normalizedYear: Moment) {
    // this.formPlanilla.get('fechaPlanilla')?.value
    const ctrlValue = this.formPlanilla.get('fechaPlanilla')?.value;
    ctrlValue.year(normalizedYear.year());
    this.formPlanilla.get('fechaPlanilla')?.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.formPlanilla.get('fechaPlanilla')?.value;
    ctrlValue.month(normalizedMonth.month());
    this.formPlanilla.get('fechaPlanilla')?.setValue(ctrlValue);
    datepicker.close();
  }

}
