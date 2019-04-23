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
  marked = false;
  equivalence: any;
  weak = false;
  file1
  file2

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
      if (this.controlFormatFile(files[0])) {
        this.file1 = files[0];
        var reader = new FileReader();
        this.fileToUpload = files.item(0);
      }
    }
  }

  //funzione che prende il secondo file (choreography)
  handleFileInput2(files) {
    if (files && files[0]) {
      if (this.controlFormatFile(files[0])) {
        this.file2 = files[0];
        var reader = new FileReader();

        this.fileToUpload2 = files.item(0);
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

    if (this.file1 != undefined && this.file2 != undefined) {
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
