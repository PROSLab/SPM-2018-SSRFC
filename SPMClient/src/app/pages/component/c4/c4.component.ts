import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../../service/service';
declare var cytoscape: any;

@Component({
  selector: 'app-c4',
  templateUrl: './c4.component.html',
  styleUrls: ['./c4.component.css']
})
export class C4Component implements OnInit {
  @ViewChild("btn1") closeModal1 : ElementRef 
  @ViewChild("file") myInputVariable: ElementRef;
  @ViewChild("file1") myInputVariable1: ElementRef;

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
  nomeFile: string =null;
  nomeFile2: string;
  diagramUrl: any;
  diagramUrlChor: any;
  modeler: any;
  bpmnJS: any;
  autCollaboration: string;
  autChoreography: string;
  result: any[];

  constructor(private toastr: ToastrService, private http: HttpClient, private service: Service) {
   
    
   }
   ShowDataChor(){
    var me = this;
 
    console.log(this.autChoreography)
       
         var log = this.autChoreography.split('\n');
         var i;
         var nodes = [];
         var edges = [];
         for (i = 1;i<log.length;i++){
         if (log[i]===""){
          continue; 
         }
         var obj = me.parseLine(log[i]);
         console.log(obj);
         
         if (!nodes.includes(obj.first)){
           nodes.push(obj.first);	 
         }
         if (!nodes.includes(obj.second)){
           nodes.push(obj.second);	 
         } 
         edges.push({
          source: obj.first,
          target: obj.second,
          id:i+"-"+obj.label
         });
         }
         var i;
          this.result = [];
         for (i = 0; i< nodes.length; i++){
           this.result.push({
            data:{
              id:nodes[i]
            } 
           });
         }
         for (i = 0; i < edges.length; i++){
           this.result.push({
            data:edges[i],
            
            classes: "autorotate"
           });
         }
         console.log(this.result); 
    
    
      
     
    }
   showDataColl(){
    var me = this;
    console.log(this.autCollaboration)
       
         var log = this.autCollaboration.split('\n');
         var i;
         var nodes = [];
         var edges = [];
         for (i = 1;i<log.length;i++){
         if (log[i]===""){
          continue; 
         }
         var obj = me.parseLine(log[i]);
         console.log(obj);
         
         if (!nodes.includes(obj.first)){
           nodes.push(obj.first);	 
         }
         if (!nodes.includes(obj.second)){
           nodes.push(obj.second);	 
         } 
         edges.push({
          source: obj.first,
          target: obj.second,
          id:i+"-"+obj.label
         });
         }
         var i;
         var result = [];
         for (i = 0; i< nodes.length; i++){
           result.push({
            data:{
              id:nodes[i]
            } 
           });
         }
         for (i = 0; i < edges.length; i++){
           result.push({
            data:edges[i],
            
            classes: "autorotate"
           });
         }
         console.log(result); 
    
    
      
     
    }
   parseLine(a){
    var firstNode;
    var lbl;
    var secondNode;
    if (a[0]!=="("&& a.substr(-1) !== ")"){
      throw "Bad format file";
    }else{
      var endFirstNode = a.indexOf(",");
      if (endFirstNode == -1){
        throw "Bad format file";
      }else{
        firstNode = a.substr(1,endFirstNode-1);
        var labelEnd = a.lastIndexOf(",");
        if (labelEnd == -1){
          throw "Bad format file";
        }else{
          var labelStart = a.indexOf(",");
          if (labelStart == -1 || labelStart==labelEnd){
              throw "Bad format file";
            }else{
            lbl = a.substr(labelStart+1,(labelEnd-1-(labelStart)));
            lbl = lbl.replace(new RegExp("'", 'g'),'');
            lbl = lbl.replace(new RegExp('"', 'g'),'');
            
            var comma = a.lastIndexOf(',');
            if (comma == -1){
                throw "Bad format file";
              }
            secondNode = a.substr(comma+1,(a.length-2-(comma))); 
            }
        }
      }
      
    }
    return {
      first:firstNode,
      label:lbl,
      second:secondNode
    };
    
  }
 
   /* private _graphData: any = {
    nodes: [
      {data: {id: 'j', name: 'Jerry', color: '#6FB1FC'}},
      {data: {id: 'e', name: 'Elaine', color: '#EDA1ED'}},
      {data: {id: 'k', name: 'Kramer', color: '#86B342'}},
      {data: {id: 'g', name: 'George', color: '#F5A45D'}}
    ],
    edges: [
      {data: {source: 'j', target: 'e',label:'CIAOOO', color: '#6FB1FC'}},
      {data: {source: 'j', target: 'k', color: '#6FB1FC'}},
      {data: {source: 'j', target: 'g', color: '#6FB1FC'}},
 
      {data: {source: 'e', target: 'j', color: '#EDA1ED'}},
      {data: {source: 'e', target: 'k', color: '#EDA1ED'}},
 
      {data: {source: 'k', target: 'j', color: '#86B342'}},
      {data: {source: 'k', target: 'e', color: '#86B342'}},
      {data: {source: 'k', target: 'g', color: '#86B342'}},
 
      {data: {source: 'g', target: 'j', color: '#F5A45D'}}
    ]
  }; */
  ngOnInit() {
   
  }
  /* get graphData(): any {
    return this._graphData;
  }
 
  set graphData(value: any) {
    this._graphData = value;
  } */
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
      
        this.nomeFile = this.fileToUpload.name
        
        document.getElementById("file").setAttribute("data-target","#anteprimaColla")
        document.getElementById("anteprimaColla").setAttribute("class", "modal fade show")
        document.getElementById("anteprimaColla").setAttribute("style", "padding-right:16px;display:block")
       
      }
    }
  }
   ReadChoreography(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
   

    this.diagramUrlChor=fileReader.result;
    console.log(this.diagramUrlChor)
    }
    fileReader.readAsText(file);
} 
  ReadCollaboration(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

     /*  this.modeler = new Modeler({
        container: '#canvas',
        width: '100%',
      
      }); */
      
    this.diagramUrl=fileReader.result;
    /* this.modeler.importXML(this.diagramUrl ) */
    console.log(this.diagramUrl)
    }
    fileReader.readAsText(file);
} 

  choose(inform){
    
    document.getElementById("file").setAttribute("data-target","")
  document.getElementById("anteprimaColla").setAttribute("class", "modal")
        document.getElementById("anteprimaColla").setAttribute("style", "")
/*   this.clearModal(this.closeModal1)
 */
if(inform=="refuse"){
  //rifiuto il file che ho caricato quindi ripristino iniziale
 
  this.myInputVariable.nativeElement.value = "";

}
//accetto il file quindi lo rendo ufficiale
}


//how to close a modal
clearModal(modal):any{
  modal.nativeElement.click()
  }


  choose2(inform){
    
    document.getElementById("file1").setAttribute("data-target","")
  document.getElementById("anteprimaChor").setAttribute("class", "modal")
        document.getElementById("anteprimaChor").setAttribute("style", "")
/*   this.clearModal(this.closeModal1)
 */
if(inform=="refuse"){
  //rifiuto il file che ho caricato quindi ripristino iniziale
  this.myInputVariable1.nativeElement.value = "";



}
//accetto il file quindi lo rendo ufficiale


}
 

  //funzione che prende il secondo file (choreography)
  handleFileInput2(files) {
    if (files && files[0]) {
      if (this.controlFormatFile(files[0])) {
        this.file2 = files[0];
        var reader = new FileReader();

        this.fileToUpload2 = files.item(0);
         this.ReadChoreography(this.fileToUpload2)
 
        this.nomeFile2 = this.fileToUpload2.name
        document.getElementById("file1").setAttribute("data-target","#anteprimaChor")
        document.getElementById("anteprimaChor").setAttribute("class", "modal fade show")
        document.getElementById("anteprimaChor").setAttribute("style", "padding-right:16px;display:block;")
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


    if ((  this.myInputVariable1.nativeElement.value !="")
    &&  ( this.myInputVariable.nativeElement.value != "")
    ) {
      
     
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
