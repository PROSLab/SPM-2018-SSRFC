import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../../service/service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-c4',
  templateUrl: './c4.component.html',
  styleUrls: ['./c4.component.css']
})
export class C4Component implements OnInit {
  fileToUpload: File;
  fileToUpload2: File;
  a: any;
  a2: any;
  checked: boolean = false;
  choreography: any;
  collaboration: any;

  constructor(private toastr: ToastrService, private http: HttpClient, private service: Service) { }

  ngOnInit() {
  }

//funzione per il controllo del formato dei file (se è bpmn)
  controlFormatFile(f) {
    if (f.name.split('.').pop() == "bpmn") {
      return true;
    }
    else {
      this.toastr.error('Error , you can choose file only with .bpmn format', 'File Format')
      return false;
    }
  }

//funzione che prende il primo file (collaboration)
  handleFileInput1(files) {
    if (files && files[0]) {
      var myFile = files[0];
      var reader = new FileReader();

     /*  reader.onload = (event: Event) => {
        this.a = this.controlFormatFile(this.fileToUpload)
      } */
      this.fileToUpload = files.item(0);
     // reader.readAsText(myFile);
    }
  } 

//funzione che prende il secondof ile (choreography)
   handleFileInput2(files) {
    if (files && files[0]) {
      var myFile = files[0];
      var reader = new FileReader();
      /* reader.onload = (event: Event) => {
        this.a2 = this.controlFormatFile(this.fileToUpload2)
      } */
      this.fileToUpload2 = files.item(0);
      //reader.readAsText(myFile);
    }
  } 

  //funzione che richiama la post al server e gli passa i 2 files
  CheckEquivalence() {
   
    /* if (this.a && this.a2) { */
      console.log(this.fileToUpload,this.fileToUpload2)
      this.service.submitC4(this.fileToUpload,this.fileToUpload2)
        .subscribe(data => {
         
        data=   JSON.parse(data)
        this.collaboration = data.collaboration
        this.choreography = data.choreography
        console.log(data)
          this.checked=true;
        },
          error => {
            console.log(error)
          })
   /*  }
    else {
      window.alert("non ok")
    } */
  }
}
