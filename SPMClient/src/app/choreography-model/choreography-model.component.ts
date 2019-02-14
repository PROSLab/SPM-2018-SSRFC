import { Component, OnInit } from '@angular/core';


  import ChoreoModeler from 'chor-js/lib/Modeler';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Service } from '../service/service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-choreography-model',
  templateUrl: './choreography-model.component.html',
  styleUrls: ['./choreography-model.component.css']
})
export class ChoreographyModelComponent implements OnInit {
  
  
 
  constructor(private toastr: ToastrService, private http: HttpClient, private service: Service, public router: Router, route: ActivatedRoute) {
  
  }


  handleError(err: any) {
    if (err) {
      console.log("errroreee")
      console.warn('Ups, error: ', err);
    }
  }
  ngOnInit() {

    var modeler = new ChoreoModeler({
      container: '#canvas',
      width: '100%',
      height: '500px',
      keyboard: {
        bindTo: document
      }
    });
    const url = '/assets/bpmn/choreographyinitial.bpmn'    
    this.http.get(url, {
      headers: {}, responseType: 'text'
    }).subscribe(
      (x: any) => {
      
        modeler.importXML(x, this.handleError)
      },
    );
    /* modeler.setXML('./resources/multiple.bpmn').then(result => {
      return modeler.displayChoreography({
        choreoID: '_choreo1'
      });
    }).then(result => {
      modeler.get('canvas').zoom('fit-viewport');
    }).catch(error => {
      console.error('something went wrong: ', error);
    }); */
  }
 /*  function saveSVG(done) {
    this.modeler.saveSVG(done);
  }
   */
  /* function saveDiagram(done) {
    this.modeler.saveXML({ format: true }, function(err, xml) {
      done(err, xml);
    });
  } */
  
  /* $(function() {
    var downloadLink = $('#js-download-diagram');
    var downloadSvgLink = $('#js-download-svg');
  
    $('.buttons a').click(function(e) {
      if (!$(this).is('.active')) {
        e.preventDefault();
        e.stopPropagation();
      }
    }); */
  
  /*   function setEncoded(link, name, data) {
      var encodedData = encodeURIComponent(data);
      if (data) {
        link.addClass('active').attr({
          'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
          'download': name
        });
      } else {
        link.removeClass('active');
      }
    } */
  
  /*   var exportArtifacts = debounce(function() {
      saveSVG(function(err, svg) {
        setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
      });
      saveDiagram(function(err, xml) {
        setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
      });
    }, 500);
  
    this.modeler.on('commandStack.changed', exportArtifacts);
    exportArtifacts();
  }); */
  
  // expose bpmnjs to window for debugging purposes
 /*  window.bpmnjs = this.modeler; */
  
  // helpers //////////////////////
 /*  
  function debounce(fn, timeout) {
  
    var timer;
  
    return function() {
      if (timer) {
        clearTimeout(timer);
      }
  
      timer = setTimeout(fn, timeout);
    };
  } */
}
