import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { PswRecoveryComponent } from './psw-recovery/psw-recovery.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component'
import { HomeComponent } from './home/home.component';

const routes: Routes = 
[  
{path:'', redirectTo:'home', pathMatch:'full'},
{path:'home', component:HomeComponent},
{path:'login',component: LoginComponent},
{path:'registrazione',component:RegistrazioneComponent},
{path:'pswrecovery',component:PswRecoveryComponent},
{path:'**', component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {enableTracing:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
