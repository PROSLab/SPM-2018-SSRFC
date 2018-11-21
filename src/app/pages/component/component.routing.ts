import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PswRecoveryComponent } from './psw-recovery/psw-recovery.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'


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
    },
    ]
  }
];
