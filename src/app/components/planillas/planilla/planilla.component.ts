import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ObsService } from 'src/app/providers/obs.service';
import { PlanillasService } from 'src/app/providers/planillas.service';

@Component({
  selector: 'app-planilla',
  templateUrl: './planilla.component.html',
  styleUrls: ['../planillas.component.css']
})
export class PlanillaComponent implements OnInit, OnDestroy {

  ajustesBonosAfectos: any[] = [];
  ajustesDescuentos: any[] = [];
  ajustesBonosNoAfectos: any[] = [];

  displayedColumns: string[] = ['Empleado', 'S.Día', 'D.Ordinarios', 'Ordinario', 'D.Séptimos', 'Séptimo', 'D.Vacaciones', 'Vacaciones'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data: any[] = [];

  showFormAjuste = false;

  formRegisto!: FormGroup;
  userActive: any;
  formAjustes!: FormGroup;

  empleados: any[] = [];
  ajustes: any[] = [];
  empleadosSelect: any[] = [];
  empleadosTabla: any[] = [];

  useAjustes: any[] = [];

  planilla: any;
  subUid: Subscription;
  subMessage: Subscription;

  formCreated = false;

  constructor(private planillasService: PlanillasService, private obsService: ObsService, private rutaActiva: ActivatedRoute, private fb: FormBuilder) {
    const id = this.rutaActiva.snapshot.params.id;
    this.subUid = this.obsService.observableUid$.subscribe(() => {
      this.getPlanilla(id);
    });
    this.subMessage = this.obsService.observableMessage$.subscribe((id)=> {

    });
    if (this.obsService.uid) {
      this.getPlanilla(id);
    }
  }

  ngOnDestroy() {
    this.subUid.unsubscribe();
    this.subMessage.unsubscribe();
  }

  createForm() {
    this.formCreated = true;
    console.log('ESTE ES EL CREATE FORM');

    let maxValidOrdinario;
    let maxValidSeptimo;
    if (this.planilla.tipoPlanilla == 'Mensual') {
      maxValidOrdinario = 26;
      maxValidSeptimo = 4;
    } else {
      maxValidOrdinario = 13;
      maxValidSeptimo = 2;
    }
    this.formRegisto = this.fb.group({
      empleadoActive: ['', Validators.required],
      diasOrdinarios: [null, [Validators.required, Validators.min(0), Validators.max(maxValidOrdinario)]],
      diasSeptimos: [null, [Validators.required, Validators.min(0), Validators.max(maxValidSeptimo)]],
      vacaciones: [0, [Validators.required, Validators.min(0)]],
    });

    this.ajustes = JSON.parse(this.planilla.ajustes);
    if (this.ajustes.length != 0) {
      console.log('ESTE ES EL CREATE FORM AJUSTES');

      this.formAjustes = this.fb.group({
      });
      this.ajustes.forEach(ajuste => {
        if (ajuste.estado == true) {

          console.log(ajuste);
          let valorAplica;
          if (ajuste.aplicaTodos == false) {
            valorAplica = null;
          } else {
            valorAplica = true;
          }
          this.formAjustes.addControl('aplica' + ajuste.id, new FormControl({ value: valorAplica, disabled: ajuste.aplicaTodos }, [Validators.required]));

          if (ajuste.definicionAjuste == 'Porcentaje') {
            this.formAjustes.addControl(ajuste.id, new FormControl({ value: ajuste.porcentaje, disabled: false }, [Validators.required]));
          } else {
            this.formAjustes.addControl(ajuste.id, new FormControl({ value: ajuste.cantidad, disabled: false }, [Validators.required]));
          }
          this.useAjustes.push(ajuste);
        }
      })
      this.showFormAjuste = true;
      this.createTable();
    }
  }

  createTable() {
    if (this.useAjustes.length > 0) {

      this.useAjustes.forEach(ajuste => {
        if (ajuste.tipoAjuste == 'Bono') {
          if (ajuste.afectoDescuentos == true) {
            this.ajustesBonosAfectos.push(ajuste);
          } else {
            this.ajustesBonosNoAfectos.push(ajuste);
          }
        } else {
          this.ajustesDescuentos.push(ajuste);
        }
      });
      this.ajustesBonosAfectos.forEach(ajuste => {
        this.displayedColumns.push(ajuste.descripcion);
        this.columnsToDisplay.push(ajuste.descripcion);
      });
      this.displayedColumns.push('Salario Total');
      this.columnsToDisplay.push('Salario Total');
      this.ajustesDescuentos.forEach(ajuste => {
        this.displayedColumns.push(ajuste.descripcion);
        this.columnsToDisplay.push(ajuste.descripcion);
      });
      this.displayedColumns.push('Total Deducciones');
      this.columnsToDisplay.push('Total Deducciones');
      this.ajustesBonosNoAfectos.forEach(ajuste => {
        this.displayedColumns.push(ajuste.descripcion);
        this.columnsToDisplay.push(ajuste.descripcion);
      });
      this.displayedColumns.push('Liquido');
      this.columnsToDisplay.push('Liquido');
      this.displayedColumns.push('Opción');
      this.columnsToDisplay.push('Opción');

      console.log(this.displayedColumns);
      console.log(this.columnsToDisplay);
    } else {
      this.columnsToDisplay.push('Salario Total');
      this.displayedColumns.push('Salario Total');
      this.columnsToDisplay.push('Total Deducciones');
      this.displayedColumns.push('Total Deducciones');
      this.columnsToDisplay.push('Liquido');
      this.displayedColumns.push('Liquido');
      this.displayedColumns.push('Opción');
      this.columnsToDisplay.push('Opción');
      console.log(this.displayedColumns);
      console.log(this.columnsToDisplay);
    }

  }

  deleteP(id: string) {
    this.planillasService.deleteRegistro(id);
  }

  changeAplica(id: string) {
    const ajuste = this.useAjustes.find(ajuste => ajuste.id == id);
    console.log(ajuste);
    if (ajuste.tipoCantidad == 'Fija') {
      if (this.formAjustes.get('aplica' + id)?.value == true) {
        this.formAjustes.get(id)?.setValue(ajuste.cantidad);
      } else {
        this.formAjustes.get(id)?.setValue(0);
      }
    } else {
      if (this.formAjustes.get('aplica' + id)?.value == false) {
        this.formAjustes.get(id)?.setValue(0);
      }
    }
  }


  ngOnInit(): void {
  }

  getPlanilla(id: string) {
    console.log('ENTRA AL GET PLANILLA');

    this.planillasService.planillas.subscribe((data: any[]) => {
      this.planilla = data.find(planilla => planilla.id == id);
      // this.createForm();
      this.planillasService.getRegistros(this.planilla?.id ? this.planilla?.id : undefined);
      const registros = this.planillasService.registros;
      registros.subscribe((data:any) => {
        this.data = data;
        this.initSelectEmpleados(data);
      }, err => {
        console.log(err);
      })
      console.log('ESTA ES LA PLANILLA', this.planilla);
      this.empleados = JSON.parse(this.planilla?.empleados ? this.planilla?.empleados : '[]')
      // this.empleados.forEach(empleado => {
      //   this.empleadosSelect.push(empleado);
      // });
      // console.log('EMPLEADOS DEL SELECT', this.empleadosSelect)
      if (this.formCreated == false) {
        this.createForm();
      }
    });
  }

  initSelectEmpleados(registros: any[]) {
    this.empleadosSelect = [];
    this.empleados.forEach(empleado => {
      this.empleadosSelect.push(empleado);
      registros.forEach(reg => {
        if(reg.empleadoId == empleado.id) {
          this.empleadosSelect.pop();
        }
      });
    });
  }

  retStrig(texto: string) {
    return texto.toString();
  }

  accept() {
    if (this.formAjustes) {
      console.log(this.formAjustes.value);
    }
    if (this.formRegisto) {
      console.log(this.formRegisto.value);
    }
    let registro: any = {
      Empleado: this.userActive.nombreCompleto,
      empleadoId: this.userActive.id,
      'S.Día': this.userActive.puesto.salarioDiario,
      'D.Ordinarios': this.formRegisto.get('diasOrdinarios')?.value,
      'Ordinario': (this.userActive.puesto.salarioDiario * this.formRegisto.get('diasOrdinarios')?.value).toFixed(2),
      'D.Séptimos': this.formRegisto.get('diasSeptimos')?.value,
      'Séptimo': (this.userActive.puesto.salarioDiario * this.formRegisto.get('diasSeptimos')?.value).toFixed(2),
      'D.Vacaciones': this.formRegisto.get('vacaciones')?.value,
      'Vacaciones': (this.userActive.puesto.salarioDiario * this.formRegisto.get('vacaciones')?.value).toFixed(2),
    };
    let salarioTotal = 0;
    if (this.ajustesBonosAfectos.length > 0) {
      this.ajustesBonosAfectos.forEach(ajuste => {
        let valor = Number(this.formAjustes.get(ajuste.id)?.value);
        if (ajuste.totalProporcionalDiasLab == true) {
          let diasTotales = Number(registro['D.Ordinarios']) + Number(registro['D.Séptimos']) + Number(registro['D.Vacaciones']);
          if (diasTotales > 30) {
            diasTotales = 30;
          }
          valor = parseFloat(((valor / 30) * diasTotales).toFixed(2));
          registro[ajuste.descripcion] = valor;
          salarioTotal = salarioTotal + valor;
        } else {
          registro[ajuste.descripcion] = valor;
          salarioTotal = salarioTotal + valor;
        }
      });
    }
    salarioTotal = salarioTotal + Number(registro['Ordinario']);
    salarioTotal = salarioTotal + Number(registro['Séptimo']);
    salarioTotal = salarioTotal + Number(registro['Vacaciones']);
    registro['Salario Total'] = salarioTotal;

    let totalDeducciones = 0;
    if (this.ajustesDescuentos.length > 0) {
      this.ajustesDescuentos.forEach(ajuste => {

        let valor = Number(this.formAjustes.get(ajuste.id)?.value);
        console.log('descuento', ajuste, valor);
        if (ajuste.definicionAjuste == 'Porcentaje') {
          valor = parseFloat(((salarioTotal * valor) / 100).toFixed(2));
          registro[ajuste.descripcion] = valor;
          totalDeducciones = totalDeducciones + valor;
        } else {
          registro[ajuste.descripcion] = valor;
          totalDeducciones = totalDeducciones + valor;
        }
      });
    }

    registro['Total Deducciones'] = totalDeducciones;

    let totalBonosNoAfectos = 0;
    if (this.ajustesBonosNoAfectos.length > 0) {
      this.ajustesBonosNoAfectos.forEach(ajuste => {
        let valor = Number(this.formAjustes.get(ajuste.id)?.value);

        if (ajuste.totalProporcionalDiasLab == true) {
          let diasTotales = Number(registro['D.Ordinarios']) + Number(registro['D.Séptimos']) + Number(registro['D.Vacaciones']);
          if (diasTotales > 30) {
            diasTotales = 30;
          }
          valor = parseFloat(((valor / 30) * diasTotales).toFixed(2));
          registro[ajuste.descripcion] = valor;
          totalBonosNoAfectos = totalBonosNoAfectos + valor;
        } else {
          registro[ajuste.descripcion] = valor;
          totalDeducciones = totalDeducciones + valor;
        }
      });
    }

    const liquidoTotal = parseFloat((registro['Salario Total'] - registro['Total Deducciones'] + totalBonosNoAfectos).toFixed(2));
    registro['Liquido'] = liquidoTotal;



    console.log('ESTE ES EL REGISTRO', registro);
    this.planillasService.saveRegistro(registro);
    this.formAjustes.reset();
    this.formRegisto.reset();
    // const list = [registro];
    // this.data = list;
  }



  selectEmpleadoActive() {
    this.userActive = this.empleadosSelect.find(empleado => empleado.id == this.formRegisto.get('empleadoActive')?.value);
    console.log('USUARIO SELECCIONADO', this.userActive);
  }


}
