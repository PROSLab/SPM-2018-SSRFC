import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
 import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';
import { FileComponent } from './file/file.component';
import { RepositoryComponent } from './Repository/repository.component';
import { RepoPublicComponent } from './repo-public/repo-public.component';
import { FolderComponent } from './folder/folder.component';
import { BpmnComponent } from '../../bpmn-component/bpmn.component';
import { DiagramComponent } from './diagram/diagram';
import { DiagramComponentChor } from './diagram/diagramChor'
import { ChoreographyModelComponent } from '../../choreography-model/choreography-model.component';
import { C4Component } from './c4/c4.component';
import { CytoscapeModule } from 'ngx-cytoscape'


@NgModule({
  imports: [

    CytoscapeModule,
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    JsonpModule  ],

  declarations: [
    DiagramComponent,
    DiagramComponentChor,
    RepositoryComponent,
    FolderComponent,
    FileComponent,
    RepoPublicComponent,
    BpmnComponent,
    ChoreographyModelComponent,
    C4Component,
 
  ]
})

export class ComponentsModule {}