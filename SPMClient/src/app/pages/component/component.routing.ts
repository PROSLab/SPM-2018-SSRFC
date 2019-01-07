import { Routes } from '@angular/router';

import { FileComponent } from './file/file.component';
import { RepositoryComponent } from './Repository/repository.component';
import { FileRepositoryComponent } from './filerepository/file.component';
import { FolderComponent } from './folder/folder.component';
import { RepoPublicComponent } from './repo-public/repo-public.component';


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
      {
        path: 'repo-public',
        component: RepoPublicComponent,
        data: {
          title: 'repo-public',
          urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'repo-public'}]
        }
    }
   ]
  }
];
