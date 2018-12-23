import { Routes } from '@angular/router';

import { FileComponent } from './file/file.component';
import { RepositoryComponent } from './Repository/repository.component';
import { AllFilesComponent } from './all-files/all-files.component';
import { FolderComponent } from './folder/folder.component';
import { FileRepositoryComponent } from './filerepository/file.component';


export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'repository',
        component: RepositoryComponent,
      },
      {
        path: 'repository/:id',
        component: FolderComponent,
      },
      {
        path: 'repository/folder/:id',
        component: FileRepositoryComponent,
      },
      {
        path: 'repository/:name/:id',
        component: FileComponent,
      },

     
      // TODO: ? A COSA SERVE?
      {
        path: 'allFiles',
        component: AllFilesComponent,
        data: {
          title: 'allFiles',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'allFiles' }]
        }
      }


    ]
  }
];
