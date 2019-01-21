import { Routes } from '@angular/router';

import { FileComponent } from './file/file.component';
import { RepositoryComponent } from './Repository/repository.component';
import { FolderComponent } from './folder/folder.component';
import { RepoPublicComponent } from './repo-public/repo-public.component';
import { BpmnComponent } from '../../bpmn-component/bpmn.component';


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
        path: 'repositoryID/:idRepo/folderID/:idFolder/fileID/:idFile/editorBPMN/:version',
        component:BpmnComponent
      },
      {
        path: 'repo-public',
        component: RepoPublicComponent,
        data: {
          title: 'repo-public',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'repo-public' }]
        }
      }
    ]
  }
];
