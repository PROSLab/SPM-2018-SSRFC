import { Component, OnInit } from '@angular/core';


  import ChoreoModeler from 'chor-js/lib/Modeler';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Service } from '../service/service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-choreography-model',
  templateUrl: './choreography-model.component.html',
  styleUrls: ['./choreography-model.component.css']
})
export class ChoreographyModelComponent implements OnInit {
  modeler;
  folderSelected: any;
  idRepoSelected: any;
  idUser: string;
  isLogged: any;
  idFile: any;
  file
  idFileCreato: any;
  version: boolean;
  data: any;
  filetoUpload;
  proviamo: any;
  nameFile: any;
  bodyFile: any;
  soundness: string = null;
  safeness: string = null;
  error: any = null;
  TerzoValore: any;
  errorProblem: boolean=null;
  validity: boolean=false;
  appVal: boolean =false;
  title: string;
  messageSoundness: any;
  messageSafeness: string;
  collaboration: any;
  
 
  constructor(private toastr: ToastrService, private http: HttpClient, private service: Service, public router: Router, route: ActivatedRoute) {
    this.folderSelected = route.snapshot.params.idFolder
    this.idRepoSelected = route.snapshot.params.idRepo
    this.idUser = localStorage.getItem("id")
    this.version = route.snapshot.params.version
    this.isLogged = service.isLogged;
    this.idFile = route.snapshot.params.idFile
  }


  handleError(err: any) {
    if (err) {
      console.log("errore")
      console.warn('Ups, error: ', err);
    }
  }


  ngOnInit() {

    if (this.idFile == undefined) {
      this.title="Creation File"
      console.log("lo sto creando")
      this.createFile()
    }
    else {
      this.getFileSpec()
      console.log("lo sto modificando")
      this.load() 
    }


   this.modeler = new ChoreoModeler({
      container: '#canvas',
      width: '100%',
      height: '500px',
      keyboard: {
        bindTo: document
      }
    });
  
    
  }







  openModal() {

    if (this.idFile == undefined) {
      document.getElementById("saveModal").setAttribute("data-target", "#myModalFile")

    } else {
      document.getElementById("saveModal").setAttribute("data-target", "")
      this.modify()
    }
  }

  getFileSpec() {

    this.service.getFileSpec(this.idFile)
      .subscribe(data => {
        this.file = data
        this.title=this.file.originalName
      }, error => {
      });
  }

  modify(): any {
    
    this.modeler.saveXML(
      (err: any, xml: any) => {
        this.filetoUpload = new File([xml], this.file.originalName)
        this.bodyFile = xml;
      }
    );

    this.service.SaveModificatedFile(this.idUser, this.idRepoSelected, this.idFile, this.version, this.filetoUpload, this.folderSelected)
      .subscribe( data => {
       // await this.callToSecondServer(this.idFile,this.bodyFile)
        
      }, error => {
        this.error = error
      });
    this.toastr.success('This file has been succesfully modified', 'Modify File')
  }

  createFile() {
    /* var xml=
    '<?xml version="1.0" encoding="UTF-8"?>'+
    '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:signavio="http://www.signavio.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exporter="Signavio Process Editor, http://www.signavio.com" exporterVersion="13.6.0" expressionLanguage="http://www.w3.org/TR/XPath" id="sid-6435533c-6dd4-409b-86c1-c182e39313fa" targetNamespace="http://www.signavio.com" typeLanguage="http://www.w3.org/2001/XMLSchema" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd">' +
    '<choreography id="sid-a085f3f6-4205-4dd4-b96d-a1cd7ebf5099" isClosed="false">' + 
       '<participant id="sid-433CA71E-5BC6-425A-AAC5-8D3AA3CC0AB0" name="">' +
          '<extensionElements>' +
             '<signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>'+
          '</extensionElements>' +
       '</participant>' +
      '<participant id="sid-7607BADD-0CF4-4370-8BB6-D88897148C33" name="">'+
          '<extensionElements>' +
             '<signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>'+
          '</extensionElements>' +
       '</participant>' +
       '<messageFlow id="sid-57cd3215-78aa-40f8-b86d-c455c570ee4b" sourceRef="sid-433CA71E-5BC6-425A-AAC5-8D3AA3CC0AB0" targetRef="sid-7607BADD-0CF4-4370-8BB6-D88897148C33"/>'+
       '<startEvent id="sid-1B4E942F-16BC-4907-A991-EA5710DF57C9" name="">' +
          '<extensionElements>' +
             '<signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffff"/>' +
             '<signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>' +
          '</extensionElements>' +
          '<outgoing>sid-0D749C3E-38FF-44FF-BEAB-22B5DBBB89A9</outgoing>' +
 '</startEvent>' +
       '<choreographyTask id="sid-1F1BC412-7077-4185-857F-2A21299D2D22" initiatingParticipantRef="sid-433CA71E-5BC6-425A-AAC5-8D3AA3CC0AB0" loopType="None" name="">'+
          '<extensionElements>' +
             '<signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffff"/>' +
             '<signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>' +
          '</extensionElements>'+
          '<incoming>sid-0D749C3E-38FF-44FF-BEAB-22B5DBBB89A9</incoming>' +
          '<participantRef>sid-433CA71E-5BC6-425A-AAC5-8D3AA3CC0AB0</participantRef>' +
          '<participantRef>sid-7607BADD-0CF4-4370-8BB6-D88897148C33</participantRef>' +
         ' <messageFlowRef>sid-57cd3215-78aa-40f8-b86d-c455c570ee4b</messageFlowRef>' +
       '</choreographyTask>' +
       '<sequenceFlow id="sid-0D749C3E-38FF-44FF-BEAB-22B5DBBB89A9" name="" sourceRef="sid-1B4E942F-16BC-4907-A991-EA5710DF57C9" targetRef="sid-1F1BC412-7077-4185-857F-2A21299D2D22">'+
          '<extensionElements>' +
             '<signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>'+
          '</extensionElements>' +
       '</sequenceFlow>' +
    '</choreography>' +
    '<bpmndi:BPMNDiagram id="sid-3278a92c-7271-4746-9f90-363f384f4796">' +
       '<bpmndi:BPMNPlane bpmnElement="sid-a085f3f6-4205-4dd4-b96d-a1cd7ebf5099" id="sid-499d2b95-aa8a-4288-87fe-73503de0a2ab">'+
          '<bpmndi:BPMNShape bpmnElement="sid-1B4E942F-16BC-4907-A991-EA5710DF57C9" id="sid-1B4E942F-16BC-4907-A991-EA5710DF57C9_gui">'+
             '<omgdc:Bounds height="30.0" width="30.0" x="90.0" y="120.0"/>' +
          '</bpmndi:BPMNShape>'+
          '<bpmndi:BPMNShape bpmnElement="sid-1F1BC412-7077-4185-857F-2A21299D2D22" id="sid-1F1BC412-7077-4185-857F-2A21299D2D22_gui">'+
             '<omgdc:Bounds height="140.0" width="150.0" x="165.0" y="65.0"/>' +
          '</bpmndi:BPMNShape>'+
          '<bpmndi:BPMNShape bpmnElement="sid-433CA71E-5BC6-425A-AAC5-8D3AA3CC0AB0" choreographyActivityShape="sid-1F1BC412-7077-4185-857F-2A21299D2D22_gui" id="sid-433CA71E-5BC6-425A-AAC5-8D3AA3CC0AB0_gui" isMessageVisible="false" participantBandKind="top_initiating">'+
             '<omgdc:Bounds height="20.0" width="150.0" x="165.0" y="65.0"/>' +
          '</bpmndi:BPMNShape>' +
          '<bpmndi:BPMNShape bpmnElement="sid-7607BADD-0CF4-4370-8BB6-D88897148C33" choreographyActivityShape="sid-1F1BC412-7077-4185-857F-2A21299D2D22_gui" id="sid-7607BADD-0CF4-4370-8BB6-D88897148C33_gui" isMessageVisible="false" participantBandKind="bottom_non_initiating">'+
             '<omgdc:Bounds height="20.0" width="150.0" x="165.0" y="185.0"/>' +
          '</bpmndi:BPMNShape>' +
          '<bpmndi:BPMNEdge bpmnElement="sid-0D749C3E-38FF-44FF-BEAB-22B5DBBB89A9" id="sid-0D749C3E-38FF-44FF-BEAB-22B5DBBB89A9_gui">' +
             '<omgdi:waypoint x="120.0" y="135.0"/>' +
             '<omgdi:waypoint x="165.0" y="135.0"/>' +
          '</bpmndi:BPMNEdge>' +
       '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
 '</definitions>' */
 
  
       const url = '/assets/bpmn/choreographyinitial.bpmn'    
     this.http.get(url, {
      headers: {}, responseType: 'text'
    })
      .subscribe(
        async (xml: any) => {  
          this.modeler.importXML(xml, this.handleError);
         },
        this.handleError
      );  
  }
  
  load(): void {
   
    const url = "http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.version
    this.http.get(url, {
      headers: {}, responseType: 'text'
    })
      .subscribe(
        async (x: any) => {
          this.modeler.importXML(x, this.handleError);
        },
        this.handleError
      );
  }

  back() {
    if (this.idFile == undefined && this.folderSelected == undefined) {
      this.router.navigate(['repositoryID', this.idRepoSelected]);
    }
    else if (this.folderSelected == undefined) {
      this.router.navigate(['repositoryID', this.idRepoSelected, 'fileID', this.idFile]);
    }
    else if (this.idFile==undefined && this.folderSelected!= undefined){
     this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.folderSelected])
    }
    else{
      this.router.navigate(['repositoryID', this.idRepoSelected, 'folderID', this.folderSelected, 'fileID', this.idFile])
    }
  }

  sendTofile(fileSelected) {
    console.log('repositoryID', this.idRepoSelected, 'folderID', this.folderSelected, 'fileID', this.idFile)
    if (this.folderSelected == undefined) {
      this.router.navigate(['repositoryID', this.idRepoSelected, 'fileID', this.idFile]);
    }
    else {
      this.router.navigate(['repositoryID', this.idRepoSelected, 'folderID', this.folderSelected, 'fileID', this.idFile]);
    }
  }

  exportModel() {
    if (this.version == null) {
      this.modeler.saveXML((err: any, xml: any) => this.file = new File([xml], "diagram"));
      saveAs(this.file, "diagram.bpmn")

    } else {
      window.open("http://localhost:8080/api/file/downloadFile?idFile=" + this.idFile + "&version=" + this.version)
      /*  this.downloadFile() */
    }
    this.toastr.success('File downloaded with success', 'Download File')

  }

/* 
  CheckSoundnessAndSafeness() {
    this.modeler.saveXML(
      (err: any, xml: any) => {
        var f = new File([xml], 'diagram');
        this.bodyFile = xml
        console.log(this.bodyFile)
      });

    var headers: { "Content-Type": "application/xml" }
    const url2 = "http://pros.unicam.it:8080/S3/rest/BPMN/Verifier"

    this.http.post(url2, this.bodyFile,
      { headers: headers, responseType: "text" })
      .subscribe(
         async (data: string) => {
    document.getElementById("validation").setAttribute("data-target","#validityModal")
       document.getElementById("validityModal").setAttribute("class", "modal fade show")
      document.getElementById("validityModal").setAttribute("style", "padding-right:16px;display:block")
          this.validity=true
          this.errorProblem=false
          this.soundness = data.substr(0, 1).trim()
          var pSafeness = data.indexOf('&&') + 4
          this.safeness = data.substr(pSafeness, 1).trim()
          var subData = data.substr(pSafeness + 1)
          var p3Valore = subData.indexOf('&&') + 3
          this.TerzoValore = subData.substr(p3Valore).trim()
          this.toastr.success('Validity and Soundness verificated', 'Verifica Validity')

          console.log('soundness:', this.soundness, 'safeness:', this.safeness)
           this.setImage(this.soundness,this.safeness)

           if( this.idFile!= undefined){
            this.addValidity( this.idFile)
           }
          },
        error => {         

          this.errorProblem=true
          document.getElementById("imageSoundness").setAttribute("src","")
        document.getElementById("imageSafeness").setAttribute("src", "")
        document.getElementById("imageSoundness").setAttribute("alt","")
        document.getElementById("imageSafeness").setAttribute("alt", "")
          this.handleError
          this.toastr.error('Invalid bpmn file', 'Errore editor')
          this.safeness=null
          this.soundness=null
          this.validity=false
          if( this.idFile!= undefined){
            this.addValidity( this.idFile)
           }   
          console.log(error);
        });
    }


    close(){
      document.getElementById("validation").setAttribute("data-target","")
      document.getElementById("validityModal").setAttribute("class", "modal fade")
     document.getElementById("validityModal").setAttribute("style", "display:none")
    }

 */

  /*   callToSecondServer(idfile?,newXml?) {

      this.modeler.saveXML(
        (err: any, xml: any) => {
          var f = new File([xml], 'diagram');
          newXml = xml
          console.log(this.bodyFile)
        });

    var headers: { "Content-Type": "application/xml" }
    const url2 = "http://pros.unicam.it:8080/S3/rest/BPMN/Verifier"

    this.http.post(url2, newXml,
      { headers: headers, responseType: "text" })
      .subscribe(

        async (data: string) => {
          this.errorProblem=false
         
          this.safeness=null
          this.soundness=null
          this.validity=true
          if( this.idFile!= undefined){
            this.addValidity(this.idFile)
           }  
          this.toastr.success('This model is valid','Validity of Model')
        },
        error => {
          this.safeness=null
          this.soundness=null
          this.validity=false

          if( this.idFile!= undefined){
            this.addValidity( this.idFile)
           }   

        this.toastr.error('This model is invalid','Validity Model')
          console.log(error);
        }
      );
  } */

  save(nameFile) {
    //creazione di un nuovo file salvandolo dall'editor
    this.modeler.saveXML(
      (err: any, xml: any) => {
        console.log(xml)
        this.file = new File([xml], nameFile),
          this.bodyFile = xml
      });

    var autore = localStorage.getItem('name') + ' ' + localStorage.getItem('surname');
    this.service.postFile(this.idRepoSelected, this.idUser, this.file, autore, 'choreography', this.folderSelected)
      .subscribe(data => {
        this.idFileCreato = data.id
        //todo:qui si deve fare qualcosa che ti toglie il programma salvataggio
        this.toastr.success('File created', 'Creation File')
if(this.folderSelected==undefined){
  this.router.navigate(['repositoryID',this.idRepoSelected])

}else{
  this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.folderSelected])
}

      }, error => {
        console.log(error);
      });

  }
 

  /* addValidity(idfile) {
    if(this.isLogged==true){
    this.service.addValidity(idfile, this.soundness, this.safeness,this.validity).subscribe(
      data => { console.log("validity:",data) },
      error => { 
        console.log(error) 
      }
      )
    }
  } */

 /*  setImage(soundness,safeness){
    //PARAMETRI PER IL SOUNDNESS
    if(parseInt(soundness)==0) { //0 Unsound for dead token
        document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
        document.getElementById("imageSoundness").setAttribute("alt", "Unsound for dead token")
        this.messageSoundness = " Unsound for dead token "
      }
    if(parseInt(soundness)==1){  // 1 Unsound for proper completion violation
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
      document.getElementById("imageSoundness").setAttribute("alt", "Unsound for proper completion violation")
      this.messageSoundness = " Unsound for proper completion violation "
    }
    if(parseInt(soundness)==2){ //2 Message disregarding sound
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/4ys3vj4v/13878145.jpg")
      document.getElementById("imageSoundness").setAttribute("alt", "Message disregarding sound")
      this.messageSoundness = " Message disregarding sound "
    }

    if(parseInt(soundness)==3){ //3 Sound
      document.getElementById("imageSoundness").setAttribute("src","https://i.postimg.cc/gJdp189m/safe.jpg")
       document.getElementById("imageSoundness").setAttribute("alt", "Sound")
       this.messageSoundness = " Sound "
      }

//PARAMETRI PER IL SAFENESS
    if(parseInt(safeness)==4){ //4 Safe
      document.getElementById("imageSafeness").setAttribute("src","https://i.postimg.cc/gJdp189m/safe.jpg")
      document.getElementById("imageSafeness").setAttribute("alt", "Safe")
      this.messageSafeness = " Safe "
    }
    if(parseInt(safeness)==5){ // 5 Unsafe
      document.getElementById("imageSafeness").setAttribute("src","https://i.postimg.cc/RCLhCCGg/unsafe.jpg")
      document.getElementById("imageSafeness").setAttribute("alt", "Unsafe")
      this.messageSafeness = " Unsafe "
    }
        
  } */




 
}


