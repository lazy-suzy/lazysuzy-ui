import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../../../shared/services/utils/utils.service';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.less']
})
export class RedirectComponent implements OnInit {
  @Input() redirectUrl: string;
  @Input() redirectDetails = {};
  @Input() category: string;
  @Input() categoryUrl: string;

  constructor( private utils: UtilsService) { }

  ngOnInit() {
  }

  openSignup() {
    this.utils.openSignup();
  }
}
