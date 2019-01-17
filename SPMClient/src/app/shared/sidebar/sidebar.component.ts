import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Service } from '../../service/service';
import { exportIsLogged } from '../../pages/starter/starter.component'
import { User } from '../../service/model/user';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ap-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements AfterViewInit {
  // this is for the open close
  isActive = true;
  showMenu = '';
  showSubMenu = '';
  isLogged: boolean;
  user: User
  name: string; surname: string; email: string; password: string;

  constructor(private service: Service,public router: Router) {
    this.isLogged=this.service.isLogged
    if(this.isLogged){
        this.name = localStorage.getItem("name");
        this.surname = localStorage.getItem("surname");
        this.email = localStorage.getItem("email");
        this.password = localStorage.getItem("password");
    }
  }

  ngOnInit(): void {

  }

  logout() {
    this.service.logout();
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
  eventCalled() {
    this.isActive = !this.isActive;
  }
  // End open close
  ngAfterViewInit() {
     $(function () {
      $('.sidebartoggler').on('click', function () {
        if ($('body').hasClass('mini-sidebar')) {
          $('body').trigger('resize');
          $('.scroll-sidebar, .slimScrollDiv')
            .css('overflow', 'hidden')
            .parent()
            .css('overflow', 'visible');
          $('body').removeClass('mini-sidebar');
          $('.navbar-brand span').show();
          // $(".sidebartoggler i").addClass("ti-menu");
        } else {
          $('body').trigger('resize');
          $('.scroll-sidebar, .slimScrollDiv')
            .css('overflow-x', 'visible')
            .parent()
            .css('overflow', 'visible');
          $('body').addClass('mini-sidebar');
          $('.navbar-brand span').hide();
          // $(".sidebartoggler i").removeClass("ti-menu");
        }
      });
    }); 
  }
}
