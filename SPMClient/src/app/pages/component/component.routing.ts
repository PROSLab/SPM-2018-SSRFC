import { Routes } from '@angular/router';

import { FileComponent } from './file/file.component';
import { RepositoryComponent } from './Repository/repository.component';
import { FolderComponent } from './folder/folder.component';
import { RepoPublicComponent } from './repo-public/repo-public.component';
import { BpmnComponent } from '../../bpmn-component/bpmn.component';
import { ChoreographyModelComponent } from '../../choreography-model/choreography-model.component';
import { C4Component } from './c4/c4.component';


export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'repositoryID/:idRepo',
        component: RepositoryComponent,
       
      },{
        path: 'repositoryID/:idRepo/folderID/:idFolder',
        component: FolderComponent
      }, {
        path: 'repositoryID/:idRepo/fileID/:idFile',
        component: FileComponent
      }, {
        path: 'repositoryID/:idRepo/folderID/:idFolder/fileID/:idFile',
        component: FileComponent
      },
      {    
        path: 'repositoryID/:idRepo/editorBPMNCollaboration',
        component: BpmnComponent
      }, 
    /*   {    
        path: 'repositoryID/:idRepo/xml/:xml/editorBPMNCollaboration',
        component: BpmnComponent
      },  */
      {    
        path: 'repositoryID/:idRepo/editorBPMNChoreography',
        component: ChoreographyModelComponent
      },
      {
        path: 'repositoryID/:idRepo/folderID/:idFolder/editorBPMNCollaboration',
        component: BpmnComponent
      },
     /*  {
        path: 'repositoryID/:idRepo/folderID/:idFolder/xml/:xml/editorBPMNCollaboration',
        component: BpmnComponent
      }, */
      {
        path: 'repositoryID/:idRepo/folderID/:idFolder/editorBPMNChoreography',
        component: ChoreographyModelComponent
      }, 
      {
        path: 'repositoryID/:idRepo/folderID/:idFolder/fileID/:idFile/editorBPMNCollaboration/:version',
        component:BpmnComponent
      },
      {
        path: 'repositoryID/:idRepo/folderID/:idFolder/fileID/:idFile/editorBPMNChoreography/:version',
        component:ChoreographyModelComponent
      },
       {
        path: 'repositoryID/:idRepo/fileID/:idFile/editorBPMNCollaboration/:version',
        component:BpmnComponent
      },
      {
        path: 'repositoryID/:idRepo/fileID/:idFile/editorBPMNChoreography/:version',
        component:ChoreographyModelComponent
      },
      
      {
        path: 'repo-public',
        component: RepoPublicComponent,
        data: {
          title: 'repo-public',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'repo-public' }]
        }
      },
      
      {
        path: 'c4',
        component: C4Component,
        data: { 
          title: 'c4',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'c4' }]
        }
      },
      
    ]
  }
];
