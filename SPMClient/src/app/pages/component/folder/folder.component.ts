import { Component, OnInit } from '@angular/core';
import { Folder } from 'src/app/service/model/folder';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {
  
fold:Folder;


  constructor() { }


  ngOnInit() {
  }

}
