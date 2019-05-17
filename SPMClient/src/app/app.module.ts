 import * as $ from 'jquery'; 
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule,  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BpmnComponent } from './bpmn-component/bpmn.component';
import { SpinnerComponent } from './shared/spinner.component';
import { Service } from './service/service'; 
import {ToastrModule} from 'ngx-toastr'
import { LoginGuard } from './pages/starter/login.guard';
import {CytoscapeModule} from 'ngx-cytoscape'


@NgModule({
  declarations: [AppComponent,SpinnerComponent],
  imports: [

CytoscapeModule,
    ToastrModule.forRoot({
    timeOut:2000,
    positionClass:'toast-top-right',
    preventDuplicates:false,
    }),
   
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
     Service, 
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}