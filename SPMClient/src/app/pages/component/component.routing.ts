import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PswRecoveryComponent } from './psw-recovery/psw-recovery.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { FileComponent } from './file/file.component';
import { FolderComponent } from './folder/folder.component';
import { AllFilesComponent } from './all-files/all-files.component';
import { RepoPublicComponent } from './repo-public/repo-public.component';


export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [
    {
      path: 'login',
      component: LoginComponent,
      data: {
        title: 'login',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'login'}]
      }
    }, 
    {
      path: 'pswRecovery',
      component: PswRecoveryComponent,
      data: {
        title: 'pswRecovery',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'pswRecovery'}]
      }
    }, 
    {
      path: 'signUp',
      component: RegistrazioneComponent,
      data: {
        title: 'signUp',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'signUp'}]
      }
    },{
      path: 'PageNotFound',
      component: PagenotfoundComponent,
      data: {
        title: 'PageNotFound',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'PageNotFound'}]
      }
    },{
      path: 'NewPassword',
      component: NewPasswordComponent,
      data: {
        title: 'changePassword',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'NewPassword'}]
      }
    },
    {
      path: 'file',
      component: FileComponent,
      data: {
        title: 'file',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'file'}]
      }
    },
    {
      path: 'folder',
      component: FolderComponent,
      data: {
        title: 'folder',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'folder'}]
      }
    },
    {
      path: 'allFiles',
      component: AllFilesComponent,
      data: {
        title: 'allFiles',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'ngComponent'},{title: 'allFiles'}]
      }
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
