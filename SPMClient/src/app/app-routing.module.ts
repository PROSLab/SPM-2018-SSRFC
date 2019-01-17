import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BpmnComponent } from './bpmn-component/bpmn.component';
 import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 
const routes: Routes = [
    {
        path: '',
        loadChildren: './pages/pages.module#PagesModule'
    },
    {
        path:'ciao',
        component:BpmnComponent
    },
    { path: '**', redirectTo: 'PageNotFound' },
   
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes),  NgbModule.forRoot() ],
    exports: [RouterModule]
})
export class AppRoutingModule { }

