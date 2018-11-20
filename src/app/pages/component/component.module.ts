import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';

import { LoginComponent } from './login/login.component';
import { PswRecoveryComponent } from './psw-recovery/psw-recovery.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    NgbModule
  ],
  declarations: [
    LoginComponent,
    PswRecoveryComponent,
    RegistrazioneComponent,
    PagenotfoundComponent,
  ]
})

export class ComponentsModule {}