import { Component, OnInit } from '@angular/core';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  providers:[NgbAccordionConfig]
})
export class DashboardComponent implements OnInit {

  constructor(config: NgbAccordionConfig) { 
    config.closeOthers = true;
    config.type = 'info';
  }

  ngOnInit() {
  }

}
