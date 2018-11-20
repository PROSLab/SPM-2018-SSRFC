import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  boh(){
    window.alert("submit")
    console.log("ciaoAAAAAAAAAAAAAAAAAAAA")
  }
}
