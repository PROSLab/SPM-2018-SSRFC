import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../../service/service';
import { saveAs } from 'file-saver';
import { subscribeOn } from 'rxjs/operators';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
//import { runInThisContext } from 'vm';

declare var cytoscape :any;

@Component({
  selector: 'app-c4',
  templateUrl: './c4.component.html',
  styleUrls: ['./c4.component.css']
})

export class C4Component implements OnInit {
  @ViewChild("btn1") closeModal1: ElementRef
  @ViewChild("file") myInputVariable: ElementRef;
  @ViewChild("file1") myInputVariable1: ElementRef;
  fileToUpload: any;
  fileToUpload2: any;
  a: any;
  a2: any;
  checked: boolean = false;
  choreography: any = '';
  collaboration: any = '';
  marked = false;
  equivalence: any;
  weak = false;
  file1
  file2
  anteprima: boolean = false;
  anteprimabottoni: boolean = false;
  nomeFile: string = null;
  nomeFile2: string;
  diagramUrl: any;
  diagramUrlChor: any;
  modeler: any;
  bpmnJS: any;
  autCollaboration;
  autChoreography;
  result: any[];
  state: any;
  counterExample: string;
  fileCollaborationAut: any;
  enabledgraph: boolean = false;
  reposPublic: any;
  errorMessage: any;
  repos: any;
  la: any;
  lunghezza: number;
  target = "Choose Repository"
  allFolder: any;
  allFile: any;
  idRepo: any;
  vers = <any>[];
  allFileFold: any;
  controlloRepo:boolean=false;
  controlloFoldandFile:boolean=false;
  controlloFile:boolean=false;
  versionArray=<any>[];
  allFileColl=<any>[];
  allFileChor=<any>[];
  allFileFoldColl=<any>[];
  allFileFoldChor=<any>[];
  deprecatedVers=<any>[];
  finalVersion=<any>[];
  controlloVers: boolean=false;
  controlloAnteprima: boolean=false;
  diagramUrlA: string;
  diagramUrlChorA: string;
  sonoDaFile: boolean=false;
  diagram:boolean=false;
fileSelezionato="Nessun file è stato selezionato"
  versione: any;
  fileSelezionatoChor="Nessun file è stato selezionato"
  controllocollaboration:boolean=false;
  constructor(private toastr: ToastrService, private http: HttpClient, private service: Service) {

    
  
  

   } 
 
   ShowDataChor(){
    this.diagram=true;
    var me = this;
    this.http.get(this.service.baseUrl+"api/modelcheck/download?filename=" + this.choreography + "&collaboration=false", { responseType: "text" }).subscribe(response => {
      try {
        let isFileSaverSupported = !!new Blob;
      } catch (e) {
        console.log(e);
        return;
      }
      let blob = new Blob([response.toLocaleString()], { type: 'application/txt' });
      let fileReader = new FileReader();
      fileReader.onload = (e) => {


        this.autChoreography = fileReader.result;

        var log = this.autChoreography.split('\n');
        var i;
        var nodes = [];
        var edges = [];
        for (i = 1; i < log.length; i++) {
          if (log[i] === "") {
            continue;
          }
          var obj = me.parseLine(log[i]);
          console.log(obj);

          if (!nodes.includes(obj.first)) {
            nodes.push(obj.first);
          }
          if (!nodes.includes(obj.second)) {
            nodes.push(obj.second);
          }
          edges.push({
            source: obj.first,
            target: obj.second,
            id: i + "-" + obj.label
          });
        }
        var i;
        this.result = [];
        for (i = 0; i < nodes.length; i++) {
          this.result.push({
            data: {
              id: nodes[i]
            }
          });
        }
        for (i = 0; i < edges.length; i++) {
          this.result.push({
            data: edges[i],

            classes: "autorotate"
           });
         }
         var cy = cytoscape({
          container:document.getElementById('cy'), 
         // container to render in
         zoomingEnabled:true,
         scale:1,
         wheelSensitivity: 0.1,
         includeLabels :true,
          elements:this.result,
         
        
         style: [ // the stylesheet for the graph
           {
             selector: 'node',
             style: {
               'background-color': '#666',
               'label': 'data(id)',
               
                 
             }
           },
        
           {
             selector: 'edge',
             style: {
               'width': 3,
               'line-color': '#ccc',
               'target-arrow-color': '#ccc',
               'target-arrow-shape': 'triangle',
               'label': 'data(id)'
             }
           }
         ],
        
         layout: {
           
           name: 'breadthfirst',
     
           fit: true, // whether to fit the viewport to the graph
           directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
           padding: 20, // padding on fit
           circle: false, // put depths in concentric circles if true, put depths top down if false
           spacingFactor: 3.5, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
           boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
           avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
           nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
           roots: undefined, // the roots of the trees
           maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
           animate: false, // whether to transition the node positions
           animationDuration: 500, // duration of animation in ms if enabled
           animationEasing: undefined, // easing of animation if enabled,
           animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
           ready: undefined, // callback on layoutready
           stop: undefined, // callback on layoutstop
           transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
     
     
          
         }
        
       });
         console.log(this.result); 
        
      }
      fileReader.readAsText(blob);
    });
  
  }
       
   

   
    
    
   showDataColl(){
    this.diagram=true;
    var me = this;
    this.http.get(this.service.baseUrl+"api/modelcheck/download?filename=" + this.collaboration + "&collaboration=true", { responseType: "text" }).subscribe(response => {
      try {
        let isFileSaverSupported = !!new Blob;
      } catch (e) {
        console.log(e);
        return;
      }
      let blob = new Blob([response.toLocaleString()], { type: 'application/txt' });
      let fileReader = new FileReader();
      fileReader.onload = (e) => {


        this.autCollaboration = fileReader.result;

        var log = this.autCollaboration.split('\n');
        var i;
        var nodes = [];
        var edges = [];
        for (i = 1; i < log.length; i++) {
          if (log[i] === "") {
            continue;
          }
          var obj = me.parseLine(log[i]);
          console.log(obj);

          if (!nodes.includes(obj.first)) {
            nodes.push(obj.first);
          }
          if (!nodes.includes(obj.second)) {
            nodes.push(obj.second);
          }
          edges.push({
            source: obj.first,
            target: obj.second,
            id: i + "-" + obj.label
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
          var cy = cytoscape({
            container:document.getElementById('cy'), 
           // container to render in
           zoomingEnabled:true,
           scale:1,
           wheelSensitivity: 0.1,
           includeLabels :true,
            elements:this.result,
           
          
           style: [ // the stylesheet for the graph
             {
               selector: 'node',
               style: {
                 'background-color': '#666',
                 'label': 'data(id)',
                 
                   
               }
             },
          
             {
               selector: 'edge',
               style: {
                 'width': 3,
                 'line-color': '#ccc',
                 'target-arrow-color': '#ccc',
                 'target-arrow-shape': 'triangle',
                 'label': 'data(id)'
               }
             }
           ],
          
           layout: {
             
             name: 'breadthfirst',
       
             fit: true, // whether to fit the viewport to the graph
             directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
             padding: 20, // padding on fit
             circle: false, // put depths in concentric circles if true, put depths top down if false
             spacingFactor: 3.5, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
             boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
             avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
             nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
             roots: undefined, // the roots of the trees
             maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
             animate: false, // whether to transition the node positions
             animationDuration: 500, // duration of animation in ms if enabled
             animationEasing: undefined, // easing of animation if enabled,
             animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
             ready: undefined, // callback on layoutready
             stop: undefined, // callback on layoutstop
             transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
            
           }
          
         });
         
     console.log(this.result);
      }
      fileReader.readAsText(blob);
    

    });

  }

  parseLine(a) {
    var firstNode;
    var lbl;
    var secondNode;
    if (a[0] !== "(" && a.substr(-1) !== ")") {
      throw "Bad format file";
    } else {
      var endFirstNode = a.indexOf(",");
      if (endFirstNode == -1) {
        throw "Bad format file";
      } else {
        firstNode = a.substr(1, endFirstNode - 1);
        var labelEnd = a.lastIndexOf(",");
        if (labelEnd == -1) {
          throw "Bad format file";
        } else {
          var labelStart = a.indexOf(",");
          if (labelStart == -1 || labelStart == labelEnd) {
            throw "Bad format file";
          } else {
            lbl = a.substr(labelStart + 1, (labelEnd - 1 - (labelStart)));
            lbl = lbl.replace(new RegExp("'", 'g'), '');
            lbl = lbl.replace(new RegExp('"', 'g'), '');

            var comma = a.lastIndexOf(',');
            if (comma == -1) {
              throw "Bad format file";
            }
            secondNode = a.substr(comma + 1, (a.length - 2 - (comma)));
          }
        }
      }

    }
    return {
      first: firstNode,
      label: lbl,
      second: secondNode
    };

  }
 
    
  ngOnInit() {

  }
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
  /* handleFileInput1(files) {
    if (files && files[0]) {
      if (this.controlFormatFile(files[0])) {
        this.file1 = files[0];
        var reader = new FileReader();
        this.fileToUpload = files.item(0);
        console.log(this.fileToUpload)
       
        this.ReadCollaboration(this.fileToUpload)

        this.nomeFile = this.fileToUpload.name


      }
    }
  } */
  /* ReadChoreography(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {


      this.diagramUrlChor = fileReader.result;
      console.log(this.diagramUrlChor)
    }
    fileReader.readAsText(file);
  } */

  showColla(file,filevers){
    console.log(file,filevers)
      this.http.get(this.service.baseUrl+"api/file/downloadFile?idFile=" +file + "&version=" + filevers, { responseType: "text" }).subscribe(response => {
      try {
        let isFileSaverSupported = !!new Blob;
      } catch (e) {
        console.log(e);
        return;
      }
      let blob = new Blob([response.toLocaleString()], { type: 'application/txt' });
 
    
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      this.diagramUrl = fileReader.result;
   
      console.log(this.diagramUrl)
     
    }
    fileReader.readAsText(blob);
   
  });
  }
  /* ReadCollaboration(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      this.diagramUrl = fileReader.result;
   
    
    }
    fileReader.readAsText(file);
  } */

  choose(inform) {
    this.fileSelezionato="Nessun file è stato selezionato"

   
    document.getElementById("file").setAttribute("data-target", " ")
    document.getElementById("anteprimaColla").setAttribute("class", "modal")
    document.getElementById("anteprimaColla").setAttribute("style", "")
    /*   this.clearModal(this.closeModal1)
     */
    if (inform == "refuse") {
      //rifiuto il file che ho caricato quindi ripristino iniziale

      this.myInputVariable.nativeElement.value = "";

    }
    //accetto il file quindi lo rendo ufficiale
  }


  //how to close a modal
  clearModal(modal): any {
    modal.nativeElement.click()
  }


  choose2(inform) {
    this.fileSelezionatoChor="Nessun file è stato selezionato"

    document.getElementById("file1").setAttribute("data-target", "")
    document.getElementById("anteprimaChor").setAttribute("class", "modal")
    document.getElementById("anteprimaChor").setAttribute("style", "")
    /*   this.clearModal(this.closeModal1)
     */
    if (inform == "refuse") {
      //rifiuto il file che ho caricato quindi ripristino iniziale
      this.myInputVariable1.nativeElement.value = "";
    }
    //accetto il file quindi lo rendo ufficiale


  }


  //funzione che prende il secondo file (choreography)
  /* handleFileInput2(files) {
    if (files && files[0]) {
      if (this.controlFormatFile(files[0])) {
        this.file2 = files[0];
        var reader = new FileReader();

        this.fileToUpload2 = files.item(0);
        this.ReadChoreography(this.fileToUpload2)

        this.nomeFile2 = this.fileToUpload2.name
        document.getElementById("file1").setAttribute("data-target", "#anteprimaChor")
        document.getElementById("anteprimaChor").setAttribute("class", "modal fade show")
        document.getElementById("anteprimaChor").setAttribute("style", "padding-right:16px;display:block;")
      }
    }
  } */


  checkAut(equivalence, weak) {
    this.equivalence = equivalence
    this.weak = weak
    if (this.weak == undefined) {
      this.weak = false
    }
  
    this.checked = true;
   
    this.service.checkEquivalence(this.weak,this.equivalence,this.collaboration,this.choreography)
  .subscribe(data =>{
 var checkEqui =JSON.parse(data)
 console.log(checkEqui)
this.counterExample=checkEqui.counterExample
this.state=checkEqui.resultState
}, error => {
  console.log(error);
});
 /*    $.ajax({
      method: "POST",

      url: "http://pros.unicam.it:8080/C4/rest/files/check_equivalence",
      data: parameters,
      success: function (data) {

        console.log("successo")
        console.log(data)
        me.state = data.resultState;
        if (data.counterExample == "") {
          me.counterExample = "No counterExample possible"
        }
        else {

          me.counterExample = data.counterExample;
        }



      },
      error: function (e) {

        

      }
    }); */
  }


  //funzione che richiama la post al server e gli passa i 2 files
  CheckEquivalence() {


   if ((this.fileSelezionato != "Nessun file è stato selezionato")
      && (this.fileSelezionatoChor != "Nessun file è stato selezionato")
    ) { 


      this.toastr.success('Wait a moment please', 'waiting')
      this.service.submitC4(this.fileToUpload, this.fileToUpload2)
        .subscribe(data => {

          var mcrl =JSON.parse(data) 
          this.collaboration = mcrl.collaboration
          this.choreography = mcrl.choreography
          console.log(mcrl)
        },
          error => {
            console.log(error)
          })
     } 
     else {
      this.toastr.error('Error , you must upload file', 'File upload')
    } 
  }



  downloadColl() {
    this.http.get(this.service.baseUrl+"api/modelcheck/download?filename=" + this.collaboration + "&collaboration=true", { responseType: "text" }).subscribe(response => {
      try {
        let isFileSaverSupported = !!new Blob;
      } catch (e) {
        console.log(e);
        return;
      }
      let blob = new Blob([response.toLocaleString()], { type: 'application/txt' });
      saveAs(blob, this.collaboration);
    });
  }
  downloadChor() {
    this.http.get(this.service.baseUrl+"api/modelcheck/download?filename=" + this.choreography + "&collaboration=false", { responseType: "text" }).subscribe(response => {
      try {
        let isFileSaverSupported = !!new Blob;
      } catch (e) {
        console.log(e);
        return;
      }
      let blob = new Blob([response.toLocaleString()], { type: 'application/txt' });
      saveAs(blob, this.choreography);
    });
  }
controlloModal(){
  this.controlloRepo=true;
  this.controlloFile=false;
  this.controlloFoldandFile=false;
  this.controlloVers=false;
  this.controlloAnteprima=false;
}
acceptFile(){
 
 if (this.vers.fileType=="collaboration"){
this.fileSelezionato=this.vers.originalName
this.http.get(this.service.baseUrl+"api/file/downloadFile?idFile=" + this.vers.id + "&version=" + this.versione , { responseType: "text" } ).subscribe(response => {
  this.fileToUpload=new File([response.toLocaleString()],this.vers.originalName);
 
})
 } else if (this.vers.fileType=="choreography") { 
this.fileSelezionatoChor=this.vers.originalName
this.http.get(this.service.baseUrl+"api/file/downloadFile?idFile=" + this.vers.id + "&version=" + this.versione , { responseType: "text" } ).subscribe(response => {
  this.fileToUpload2=new File([response.toLocaleString()],this.vers.originalName);
 
})
 }
}
paginaPrima()
{
  this.diagram=false;
}
getAllReposChor() {
  this.controllocollaboration=false  
  this.controlloRepo=true;
  this.controlloFile=false;
  this.controlloFoldandFile=false;
  this.controlloVers=false;
  this.controlloAnteprima=false;

  this.service.getAllRepo().subscribe(data => {
    
    this.repos = JSON.parse(data)
    this.controlloRepo=true;
  }, error => {
    this.errorMessage = <any>error
  });
}
  getAllRepos() {
    this.controllocollaboration=true
    this.controlloRepo=true;
    this.controlloFile=false;
    this.controlloFoldandFile=false;
    this.controlloVers=false;
    this.controlloAnteprima=false;

    this.service.getAllRepo().subscribe(data => {
      
      this.repos = JSON.parse(data)
      this.controlloRepo=true;
    }, error => {
      this.errorMessage = <any>error
    });
  }

  AllRepoInfo(id) {
    this.controlloRepo=false;
    
    this.idRepo=id;

    this.service.getAllFolder(id)
  
    .subscribe(data => {
      if(data != []){
     this.allFolder = JSON.parse(data)
     this.controlloFoldandFile=true;

      }
      else{
      }

    }, error => {
      this.errorMessage = <any>error
    });

    this.service.getFile(id)
    .subscribe(data => {
      this.allFileColl=[];
      this.allFileChor=[]
      var file =JSON.parse(data)
    
      var j=0;
      var z=0;
    for(let i=0;i<file.length;i++){
     
if (file[i].fileType=="collaboration"){
  
  this.allFileColl[j]=file[i]
  j++
}
else{
  this.allFileChor[z]=file[i]
  z++
}
    }
 
    }
    
    
    , error => {
      this.errorMessage = <any>error
    });
  

  }
chooseVers(id){
  this.controlloVers=true
if(this.controlloFoldandFile==true){
  this.controlloFoldandFile=false
  this.sonoDaFile=false;
} else{
  this.controlloFile=false
  this.sonoDaFile=true
}
  this.service.getFileSpec(id)
  .subscribe(data => {
   this.vers = (data)
   console.log(this.vers)
  this.versionArray=[]
  this.finalVersion=[]
  this.deprecatedVers=[]
   for (var i = 0; i < this.vers.cVersion; i++) {
    this.versionArray[i] = this.vers.cVersion - (this.vers.cVersion - i) + 1
  }
  
  
  //mi salvo le versioni deprecate
  for (var i = 0; i < this.vers.deletedVersions.length; i++) {
    this.deprecatedVers[i] = this.vers.deletedVersions[i]
  }

  var j = 0;
  for (i = 0; i < this.versionArray.length; i++) {
    if (this.deprecatedVers.indexOf(this.versionArray[i]) == -1) {
      this.finalVersion[j] = this.versionArray[i]
      j++
    }
  }

  }, error => {
    this.errorMessage = <any>error
  });
}
anteprimaFile(vers){
  this.versione=vers
  this.controlloAnteprima=true;
if (this.vers.fileType=="collaboration"){

 this.diagramUrlA=this.service.baseUrl+"api/file/downloadFile?idFile=" + this.vers.id + "&version=" + vers
}else {
  this.diagramUrlChorA=this.service.baseUrl+"api/file/downloadFile?idFile=" + this.vers.id + "&version=" + vers}
}

back(){
  if (this.controlloVers==true && this.sonoDaFile==false){
  this.controlloAnteprima=false;
  this.controlloVers=false,
  this.controlloFoldandFile=true
  } else if (this.controlloVers==true && this.sonoDaFile==true){
    this.controlloAnteprima=false;
    this.controlloVers=false,
    this.controlloFile=true
  } else if (this.controlloFoldandFile==true){
    this.controlloFoldandFile=false;
    this.controlloRepo=true
  }else if (this.controlloFile==true){
    this.controlloFile=false
    this.controlloFoldandFile=true;
  }
}
  AllFolderInfo(id){
    this.allFileFoldColl=[]
    this.allFileFoldChor=[]
    this.controlloFoldandFile=false;
    this.service.getFile(this.idRepo,id)
    .subscribe(data => {
      var file =JSON.parse(data)
    
      var j=0;
      var z=0;
    for(let i=0;i<file.length;i++){
     
if (file[i].fileType=="collaboration"){
  
  this.allFileFoldColl[j]=file[i]
  j++
}
else{
  this.allFileFoldChor[z]=file[i]
  z++
}
    }
  
     this.controlloFile=true

     /* console.log(this.allFile) */
    }, error => {
      this.errorMessage = <any>error
    });
  }

}


