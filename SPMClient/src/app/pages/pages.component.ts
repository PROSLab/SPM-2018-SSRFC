import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../service/service';


@Component({
    selector: 'app-layout',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PageComponent implements OnInit {

    constructor(public router: Router, private service: Service, ) {
    }

    ngOnInit() {
        if (this.router.url === '/') {
            this.router.navigate(['']);
        }
    }

}
