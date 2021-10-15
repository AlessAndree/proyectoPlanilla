import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';

import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  meses: any[] = [
    {mes: 1, nombre: 'Enero'},
    {mes: 2, nombre: 'Febrero'},
    {mes: 3, nombre: 'Marzo'},
    {mes: 4, nombre: 'Abril'},
    {mes: 5, nombre: 'Mayo'},
    {mes: 6, nombre: 'Junio'},
    {mes: 7, nombre: 'Julio'},
    {mes: 8, nombre: 'Agosto'},
    {mes: 9, nombre: 'Septiembre'},
    {mes: 10, nombre: 'Octubre'},
    {mes: 11, nombre: 'Noviembre'},
    {mes: 12, nombre: 'Diciembre'},
  ]

  constructor() { }

  createExcel(header: any[], datos: any[], info: any) {
    //create new excel work book
    let workbook = new Workbook();
    //add name to sheet
    let worksheet = workbook.addWorksheet('Planilla');
    //add column name
    header.pop();

    // let headerRow = worksheet.addRow(header);
    let num = 0;
    header.forEach(head => {
      num++;
      if (num == 1) {
        worksheet.getColumn(num).width = (head.length + 20);
      } else {
        worksheet.getColumn(num).width = (head.length + 10);
      }
    });

    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.mergeCells('B2:G2');
    worksheet.mergeCells('B3:D3');
    const titulo = worksheet.getCell('B2');
    titulo.value = info.titulo;
    titulo.font = {bold: true, size: 20}
    const fecha = worksheet.getCell('B3');
    let labelFecha;
    this.meses.forEach(m => {
      if (m.mes = info.mes) {
        labelFecha = m.nombre;
      }
    });
    labelFecha = labelFecha + ' de ' + info.year;
    fecha.value = labelFecha;
    fecha.font = {bold: true, size: 16}



    worksheet.addRow([]);
    const headerRow = worksheet.addRow(header);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        cell.alignment = { horizontal: 'center', vertical: 'middle' },
        cell.font = { size: 12.5, bold: true, color: { argb: 'FFFFFF' } },
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1e364d' } }
    });

    datos.forEach(registro => {
      let temp: any[] = []
      header.forEach(head => {
        temp.push(registro[head]);
      });
      worksheet.addRow(temp)
    });

    let fname = 'Planilla - ' + info.titulo + ' - ' + labelFecha;

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
      fs.saveAs(blob, fname + '.xlsx');
    });

  }

}
