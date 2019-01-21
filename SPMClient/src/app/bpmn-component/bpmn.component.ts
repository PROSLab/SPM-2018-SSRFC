import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Modeler, OriginalPropertiesProvider, PropertiesPanelModule, InjectionNames, OriginalPaletteProvider} from "../bpmn-js/bpmn-js";
import {CustomPropsProvider} from '../props-provider/CustomPropsProvider';
import {CustomPaletteProvider} from "../props-provider/CustomPaletteProvider";
import { Service } from '../service/service';
import { Router, ActivatedRoute } from '@angular/router';
import { RightSidebarToggleDirective } from '../shared/sidebar.directive';
import {saveAs as importedSaveAs} from "file-saver";

const customModdle = {
  name: "customModdle",
  uri: "http://example.com/custom-moddle",
  prefix: "custom",
  xml: {
    tagAlias: "lowerCase"
  },
  associations: [],
  types: [
    {
      "name": "ExtUserTask",
      "extends": [
        "bpmn:UserTask"
      ],
      "properties": [
        {
          "name": "worklist",
          "isAttr": true,
          "type": "String"
        }
      ]
    },
  ]
};

@Component({
  selector: 'app-root',
  templateUrl: './bpmn.component.html',
  styleUrls: ['./bpmn.component.scss']
})
export class BpmnComponent implements OnInit {
  title = 'Angular/BPMN';
  modeler;
  folderSelected: any;
  idRepoSelected: any;
  idUser: string;
  isLogged: any;
  idFile: any;
  file

  constructor(private http: HttpClient,private service: Service,public router: Router,route: ActivatedRoute) {
    this.folderSelected = route.snapshot.params.idFolder
    this.idRepoSelected = route.snapshot.params.idRepo
    this.idUser = localStorage.getItem("id")
    this.isLogged=service.isLogged;
    this.idFile= route.snapshot.params.idFile
  }


  ngOnInit(): void {
    this.load()
    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '600px',
      additionalModules: [
        PropertiesPanelModule,

        // Re-use original bpmn-properties-module, see CustomPropsProvider
        {[InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]]},
        {[InjectionNames.propertiesProvider]: ['type', CustomPropsProvider]},

        // Re-use original palette, see CustomPaletteProvider
        {[InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider]},
        {[InjectionNames.paletteProvider]: ['type', CustomPaletteProvider]},
      ],
      propertiesPanel: {
        parent: '#properties'
      },
      moddleExtension: {
        custom: customModdle
      }
    });
  }

  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }

  load(): void {
    const url = "http://localhost:8080/api/file/downloadFile?idFile="+this.idFile+"&version="+1
/*     const url = '/assets/bpmn/initial.bpmn';
 */    this.http.get(url, {
      headers: {}, responseType: 'text'
    }).subscribe(
      (x: any) => {
        console.log('Fetched XML, now importing: ', x);
        this.modeler.importXML(x, this.handleError);
      },
      this.handleError
    );
  }


  sendTofile(fileSelected) {
    this.router.navigate(['repositoryID',this.idRepoSelected,'folderID',this.folderSelected,'fileID',fileSelected]);
    }
    
  save(): void {
   
    //creazione di un nuovo file salvandolo dall'editor
   this.modeler.saveXML((err: any, xml: any) =>    this.file = new File([xml], name)); 

     this.service.postFile(this.idRepoSelected,this.idUser,this.file,this.folderSelected).subscribe(data => {
       
      console.log(data)
    this.sendTofile(this.idFile)
      // do something, if upload success
    }, error => {
      console.log(error);
    }); 
  }

  
}
