import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { StarterComponent } from './starter.component';
import { LoginComponent } from '../login/login.component';
import { PswRecoveryComponent } from '../psw-recovery/psw-recovery.component';
import { RegistrazioneComponent } from '../registrazione/registrazione.component';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { PagenotfoundComponent } from '../pagenotfound/pagenotfound.component';
import { LoginGuard } from './login.guard';


const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				canActivate:[LoginGuard],
				component: StarterComponent,
				
			},
			{
				path: 'login',
				component: LoginComponent,
			},
			{ path:'login/pswRecovery',
          		//canActivate:[ProductDetailGuard], 
          		component:PswRecoveryComponent
			},
			// TODO: QUESTA ROOT VA SOSTITUITA CON QUELLA DI SOTTO QUANDO VERRA MODIFICATO IL LINK DEL EMAIL INVIATA NEL SERVER
			{
				path: 'NewPassword',
				component: NewPasswordComponent,
			},
			/* // TODO: QUESTA DOVREBBE ESSERE LA ROOT FINALE PER IL CAMBIO PASSWORD
			{
				path: 'login/pswRecovery/newPassword',
				component: NewPasswordComponent,
			},
			 {
				path: 'pswRecovery',
				component: PswRecoveryComponent,
			}, 
			*/
			{
				path: 'signUp',
				component: RegistrazioneComponent,
			},
			{
				path: 'PageNotFound',
				component: PagenotfoundComponent,
			},
		] 
	}		
];

@NgModule({
			imports: [
				FormsModule,
				CommonModule,
				RouterModule.forChild(routes),
				ReactiveFormsModule
			],
			declarations: [
				StarterComponent,
				LoginComponent,
				PswRecoveryComponent,
				RegistrazioneComponent,
				NewPasswordComponent,
				PagenotfoundComponent
			]
		})

export class StarterModule { }