import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/providers/firestore.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {

  // puestos$ = this.fireService.puestos;
  // private fireService: FirestoreService
  constructor() {
    // console.log('PUESTOS', this.puestos$);
    // this.puestos$.subscribe((data:any) => {
    //   console.log('PUESTOS', data);

    // } )
    // const puesto = {
    //   nombrePuesto: 'Atención al cliente',
    //   salarioMensual: 3000,
    //   salarioQuicenal: 1500,
    //   salarioDiario: 100
    // }
    // this.fireService.savePuesto(puesto).then(data => {
    //   console.log('SI JALEAS', data);
    // }, err => {
    //   console.error(err);
    // })

  }

  ngOnInit(): void {
  }

}
