import {
    AfterContentInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    ViewChild,
    SimpleChanges,
    EventEmitter
  } from '@angular/core';
  
  import { HttpClient } from '@angular/common/http';
  import { map, catchError, retry } from 'rxjs/operators';
  
  /**
   * You may include a different variant of BpmnJS:
   *
   * Viewer  - displays BPMN diagrams without the ability
   *           to navigate them
   * Modeler - bootstraps a full-fledged BPMN editor
   */
  import BpmnJS from 'chor-js/lib/NavigatedViewer';
  
  import { importDiagramChor } from './rxChor';
  
  import { throwError } from 'rxjs';
  
  @Component({
    selector: 'app-diagram-chor',
    template: `
      <div #ref class="diagram-container"></div>
    `,
    styles: [
      `
        .diagram-container {
          background-color:white;
          height: 300px;
          width: 80%;
        }
      `
    ]
  })
  export class DiagramComponentChor  implements AfterContentInit, OnChanges, OnDestroy {
    private bpmnJS: BpmnJS;
  
    @ViewChild('ref') private el: ElementRef;
    @Output() private importDone: EventEmitter<any> = new EventEmitter();
    @Input() private xml: string;

    @Input() private url: string;
  
    constructor(private http: HttpClient) {
  
      this.bpmnJS = new BpmnJS();
  
      this.bpmnJS.on('import.done', ({ error }) => {
    
        if (!error) {
           this.bpmnJS.get('canvas').zoom('fit-viewport');
          this.bpmnJS.get('canvas').resized();
        }
      });
    }
  
    ngAfterContentInit(): void {
      this.bpmnJS.attachTo(this.el.nativeElement);
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes.xml){
        this.loadXml(changes.xml.currentValue)
      }
      // re-import whenever the url changes
      if (changes.url) {
        this.loadUrl(changes.url.currentValue);
      }
    }
  
    ngOnDestroy(): void {
      this.bpmnJS.destroy();
    }

    loadXml(xml: string) {
      return(
      this.bpmnJS.importXML(xml, function(err, warnings) {
      
  })
      )
}
  
    /**
     * Load diagram from URL and emit completion event
     */
    loadUrl(url: string) {
  
      return (
        this.http.get(url, { responseType: 'text' }).pipe(
          catchError(err => throwError(err)),
          importDiagramChor(this.bpmnJS)
        ).subscribe(
          (warnings) => {
            this.importDone.emit({
              type: 'success',
              warnings
            });
          },
          (err) => {
            this.importDone.emit({
              type: 'error',
              error: err
            });
          }
        )
      );
    }
  
  }