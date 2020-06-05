import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PersonaService} from './service/persona.service';
import {FormControl, FormGroup} from '@angular/forms';
import {NotificationService} from './service/notification.server';
import {BehaviorSubject} from 'rxjs';
import {ChartDataSets} from 'chart.js';
import {BaseChartDirective, Color, Label} from 'ng2-charts';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'umg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent
  implements OnInit,
    OnDestroy,
    AfterViewInit {
  title = 'profesional';

  // definir "FormGroup" para ingreso de datos por formulario
  public formGroup: FormGroup;
  public contador: number = 0;
public texto: String = 'Oscar_Santos_Cesar_Lopez_Ruth_Hernandez_Kenny_Quiñonez';
  public texto2: String = 'Proyecto_Final_Progra3';


  // variable reactiva para actualizar interfaz web
  // subject = observable , al cual yo me puedo suscribir
  private mySubject: BehaviorSubject<any>;

  public dataListArray: Array<any>;
  public dataListSubject: BehaviorSubject<any[]>; // = Observable (suscripcion)

  lineChartData: ChartDataSets[] = [
    {
      data: [50, 100, 79, 76, 82, 90],
      label: 'LAS MAS VISTAS'
    },
  ];


  @ViewChild('baseChart') chart: BaseChartDirective;

  lineChartLabels: Label[] = ['Romance', 'Accion', 'Suspenso', 'Terror', 'Infantil', 'ficcion'];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'white',
      backgroundColor: 'rgba(color, 0.2)',

    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';


  constructor(private personaService: PersonaService,
              private notificationService: NotificationService) {

    this.mySubject = new BehaviorSubject(null);


    this.dataListArray = new Array<any>();
    this.dataListSubject = new BehaviorSubject(null);

  }

  public onClick(): void {
    console.log('on click');
  }


  public enviarFormulario(): void {
    console.log('Datos de formulario:' + JSON.stringify(this.formGroup.value));

    let parametros: any = null;
    parametros = Object.assign({}, this.formGroup.value);

    // son los datos de persona
    let datosAEnviar: any = {
      primerNombre: parametros.nombre,
      segundoNombre: parametros.apellido,
      edad: parametros.edad
    };

    console.log('Datos a enviar:' + JSON.stringify(datosAEnviar));

    this.personaService.create(datosAEnviar)
      .subscribe(result => {
        console.log('Datos from server:' + JSON.stringify(result));
      });
  }


  reloadChart() {
    if (this.chart !== undefined) {
      this.chart.chart.destroy();
      //this.chart.chart = 0;

      this.chart.datasets = this.lineChartData;
      this.chart.labels = this.lineChartLabels;
      this.chart.ngOnInit();
    }
  }

  public agregarContenidoManual(): void {
    this.mySubject.next('from button');
    console.log(this.lineChartData[0].data[0]);


    let actual: any = this.lineChartData[0].data[0];
    this.lineChartData[0].data[0] = actual + 20;
    this.reloadChart();
  }


  public agregarAVector(): void {
    this.contador++;

    let dato: any = null;
    dato = {
      id: this.contador,
      nombre: 'persona' + this.contador,
      edad: 20 + this.contador
    };

    //this.dataListArray.push({id: this.contador});
    this.dataListArray.push(dato);



    this.dataListSubject.next(this.dataListArray);
    /*   this.dataEstadisticaSubject.next(this.dataListArray);
       this.dataGraficaSubject.next(this.dataListArray);*/

  }

  public actualizarFormulario(): void {

    let parametros: any = null;
    parametros = Object.assign({}, this.formGroup.value);

    let datosAEnviar: any = {
      primerNombre: parametros.nombre,
      segundoNombre: parametros.apellido,
      edad: parametros.edad
    };

    console.log('Datos a enviar:' + JSON.stringify(datosAEnviar));

    this.personaService.update(datosAEnviar).subscribe(result => {
      console.log('Datos from server:' + JSON.stringify(result));
    });
  }


  public actualizarTexto(result: any): void {
    this.texto = this.texto + ' ' + JSON.stringify(result);
    //actualizarGrafica() llame a la funcion reloadChart();
  }


  private initForm(): void {
    this.formGroup = new FormGroup({
      nombre: new FormControl('', []
      ),
      apellido: new FormControl('', []
      ),
      edad: new FormControl('', []
      )
    });


  }

  /* ------------------------------------------------------------------------------------------------- */
  private handleMessageReceived(message: any): void {
    console.log('Mensaje recibido:' + JSON.stringify(message));
  }

  /* ------------------------------------------------------------------------------------------------- */
  public doNotificationSubscription(): void {
    try {
      this.notificationService
        .getPersonaNotification()
        .subscribe((result) => {
          console.log('Mensaje recibido:' + JSON.stringify(result));
          //actualizartabla
          this.mySubject.next(result);

        });

      /*
            this.notificationService
              .getPersonaNotification()
              .subscribe((result) => {
                console.log('Mensaje recibido:' + JSON.stringify(result));
                //actualizarGrafica
                this.mySubject.next(result);

              });*/


    } catch (e) {
      console.log(e);
    }
  }

  public doSubjectSubscription(): void {
    this.mySubject.subscribe((result) => {
      this.actualizarTexto(result);
    });


    this.mySubject.subscribe((result) => {
      this.texto2 = this.texto2 + JSON.stringify(result);
    });


    /*this.mySubject.subscribe((result)=>{
      this.actualizarGrafica(result);
    });*/

  }

  /* ------------------------------------------------------------------------------------------------- */

  ngAfterViewInit(): void {
    console.log('on after view');
  }

  ngOnDestroy(): void {
    console.log('on destroy');
  }

  /* -------------------------------------------------------------------------------------------------------------------------------- */
  initDataList(): void {
    this.contador++;

    let dato: any = null;
    dato = {
      id: this.contador,
      nombre: 'persona' + this.contador,
      edad: 20 + this.contador
    };


    //this.dataListArray.push({id: this.contador});
    //this.dataListArray.push({id: this.contador});
    this.dataListArray.push(dato);



    this.dataListSubject
      .asObservable()
      .subscribe(result => {
        //actualizarGrafica(();
        //alert('actualizacion:' + JSON.stringify(result));
      });

    /*this.dataListSubject
      .asObservable()
      .subscribe(result => {
        //actualizarDatosEstadistica();
        alert('actualizacion:' + JSON.stringify(result));
      });
*/

    this.dataListSubject.next(this.dataListArray);
  }

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  ngOnInit(): void {

    console.log('on init');

    this.initDataList();

    // realizar suscripcion
    this.doNotificationSubscription();

    // realizar subscription para subject (actualiza texto)
    this.doSubjectSubscription();

    // iniciar formulario
    this.initForm();

    // ejecutar llamada de servicio restful al iniciar la aplicacion
    this.personaService
      .personaList(null)
      .subscribe((result) => {
        console.log('RESULTADO:' + JSON.stringify(result));
      });


  }


}
