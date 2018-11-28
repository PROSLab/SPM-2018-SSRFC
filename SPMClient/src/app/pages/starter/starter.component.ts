import { Component, AfterViewInit } from '@angular/core';

@Component({
	templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
	subtitle:string;	
	email: string;
	constructor() {}


ngOnInit(){

console.log(localStorage.getItem("email"))
	if(localStorage.getItem("email")!=undefined){
	 this.email = localStorage.getItem("email")
	}
	
	else{console.log("non sei loggato")}
}


	ngAfterViewInit(){}
}