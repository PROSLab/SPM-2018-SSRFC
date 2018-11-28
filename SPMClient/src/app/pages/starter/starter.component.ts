import { Component, AfterViewInit } from '@angular/core';
import { Service } from '../../service/service';
export var isLogged:boolean;

@Component({
	templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
	subtitle: string;
	email: string;
	isLogged=isLogged;
	

	constructor(private service: Service) { }

	ngOnInit() {
		if (localStorage.getItem("email") != undefined) {
			this.email = localStorage.getItem("email");
			isLogged = true;this.isLogged=isLogged
		}
	}
	logout() {
		isLogged = false;this.isLogged=isLogged
		this.service.logout()
	}
	


	ngAfterViewInit() { }
}