import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { PswRecoveryComponent } from './psw-recovery/psw-recovery.component';

const routes: Routes = [  
  {path:'login',component: LoginComponent},

{path:'registrazione',component:RegistrazioneComponent},

{
  path:'pswrecovery',component:PswRecoveryComponent
},

/* {path:'**', component:PageNotFound}
 */];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {enableTracing:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
