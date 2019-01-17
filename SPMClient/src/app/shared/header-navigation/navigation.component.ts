import { Component, AfterViewInit } from '@angular/core';
import { Service } from '../../service/service';

@Component({
    selector: 'ap-navigation',
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
    name: string;surname:string;email:string;password:string;
    isLogged: boolean
    


    constructor(private service: Service) { 
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


  

    ngAfterViewInit() {
         $(function () {
            $(".preloader").fadeOut();
        });
        var set = function () {
            var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
            var topOffset = 70;
            if (width < 1170) {
                $("body").addClass("mini-sidebar");
                $('.navbar-brand span').hide();
                $(".scroll-sidebar, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
            } else {
                $("body").removeClass("mini-sidebar");
                $('.navbar-brand span').show();
            }
            var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $(".page-wrapper").css("min-height", (height) + "px");
            }
        };
        $(window).ready(set);
        $(window).on("resize", set);
        $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
            $(".app-search").toggle(200);
        });
        (<any>$('[data-toggle="tooltip"]')).tooltip();
        (<any>$('.scroll-sidebar')).slimScroll({
            position: 'left',
            size: "5px",
            height: '100%',
            color: '#dcdcdc'
        });
        $("body").trigger("resize"); 
    }

    logout() {
        this.service.logout()
    }

}
