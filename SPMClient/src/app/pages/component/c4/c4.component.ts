import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../../service/service';
import { Modeler } from '../../../bpmn-js/bpmn-js';
import BpmnJS from 'bpmn-js/lib/NavigatedViewer';

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
  marked = false;
  equivalence: any;
  weak = false;
  file1
  file2
  anteprima: boolean =false;
  anteprimabottoni: boolean =false;
  nomeFile: string;
  anteprima2: boolean =false;
  anteprimabottoni2: boolean =false;
  nomeFile2: string;
  file1Accepted: boolean =false;
  file2Accepted: boolean =false;
  diagramUrl: any;
  diagramUrlChor: any;
  modeler: any;
  bpmnJS: any;

  constructor(private toastr: ToastrService, private http: HttpClient, private service: Service) {
    this.bpmnJS = new BpmnJS();
  
    this.bpmnJS.on('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get('canvas').zoom('fit-viewport');
      }
    });
   }

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
      if (this.controlFormatFile(files[0])) {
        this.file1 = files[0];
        var reader = new FileReader();
        this.fileToUpload = files.item(0);
        console.log(files)
 this.ReadCollaboration(this.fileToUpload)
        this.anteprima=true
        this.anteprimabottoni = true
        this.nomeFile = this.fileToUpload.name
       
      }
    }
  }
 /*  ReadChoreography(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
   

    this.diagramUrlChor=fileReader.result;
    console.log(this.diagramUrlChor)
    }
    fileReader.readAsText(file);
} */
  ReadCollaboration(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      this.modeler = new Modeler({
        container: '#canvas',
        width: '100%',
      
      });
      
    this.diagramUrl=fileReader.result;
    this.modeler.importXML(this.diagramUrl )
    console.log(this.diagramUrl)
    }
    fileReader.readAsText(file);
} 

  choose(inform){
if(inform=="refuse"){
  //rifiuto il file che ho caricato quindi ripristino iniziale
  this.anteprima=false
}
//accetto il file quindi lo rendo ufficiale

if(inform=="accept"){
this.anteprimabottoni = false
this.file1Accepted=true
}
  }


  choose2(inform){
    if(inform=="refuse"){
      //rifiuto il file che ho caricato quindi ripristino iniziale
      this.anteprima2=false
    }
    //accetto il file quindi lo rendo ufficiale
    
    if(inform=="accept"){
    this.anteprimabottoni2 = false
    this.file2Accepted=true
    }
  }


  //funzione che prende il secondo file (choreography)
  handleFileInput2(files) {
    if (files && files[0]) {
      if (this.controlFormatFile(files[0])) {
        this.file2 = files[0];
        var reader = new FileReader();

        this.fileToUpload2 = files.item(0);
/*         this.ReadChoreography(this.fileToUpload2)
 */
        this.anteprima2=true
        this.anteprimabottoni2 = true
        this.nomeFile2 = this.fileToUpload2.name
      }
    }
  }


  checkAut(equivalence, weak) {
    this.equivalence = equivalence
    this.weak = weak
    if (this.weak == undefined) {
      this.weak = false
    }
    console.log(this.weak)
    this.service.checkEquivalence(this.weak, this.equivalence, this.collaboration, this.choreography)
      .subscribe(data => {
        console.log(data)
      },
        error => {
          console.log(error)
        })
  }


  //funzione che richiama la post al server e gli passa i 2 files
  CheckEquivalence() {
    console.log(this.file1)
    console.log(this.file2)

    if (this.file1Accepted && this.file2Accepted) {
      
      console.log(this.fileToUpload, this.fileToUpload2)
      this.toastr.success('Wait a moment please', 'waiting')
      this.service.submitC4(this.fileToUpload, this.fileToUpload2)
        .subscribe(data => {

          data = JSON.parse(data)
          this.collaboration = data.collaboration
          this.choreography = data.choreography
          console.log(data)
          this.checked = true;
          
        },
          error => {
            console.log(error)
          })
    }
    else {
      this.toastr.error('Error , you must upload file', 'File upload')
    }
  }



  downloadColl(){
      window.open("http://pros.unicam.it:8080/C4/rest/files/download?filename="+this.collaboration+"&collaboration=true")
  }
  downloadChor(){
    window.open("http://pros.unicam.it:8080/C4/rest/files/download?filename="+this.choreography+"&collaboration=false")

}

searchColl(){
  let url =("http://pros.unicam.it:8080/C4/rest/files/download?filename="+this.collaboration+"&collaboration=true")
}

searchChor(){
let url= ("http://pros.unicam.it:8080/C4/rest/files/download?filename="+this.choreography+"&collaboration=false")

}

}
