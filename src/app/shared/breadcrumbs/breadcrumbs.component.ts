import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta , MetaDefinition} from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  label  : string = '';

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) { 
    
      this.getDataRouter().subscribe(
        data => {
          console.log(data);
          this.label = data.titulo;
          this.title.setTitle(data.titulo);
          let metaDefinition: MetaDefinition = {
            name:'definicion',
            content: this.label
          };
          meta.updateTag(metaDefinition);

        }
       );
    

  }
  ngOnInit() {
  }
  getDataRouter(){
    this.router.events.filter( (events) => events instanceof ActivationEnd )
     return this.router.events
     .filter( (events) => events instanceof ActivationEnd )
     .filter( (event:ActivationEnd)=> event.snapshot.firstChild === null)
     .map((event:ActivationEnd)=> event.snapshot.data );
  }


}
