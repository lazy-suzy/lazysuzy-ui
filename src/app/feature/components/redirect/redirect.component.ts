import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../../../shared/services/utils/utils.service';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.less']
})
export class RedirectComponent implements OnInit {
  @Input() redirectUrl: string;
  @Input() redirectDetails = {
    main_image: '',
    name: '',
    price: '',
    was_price: ''
  };
  @Input() category: string;
  @Input() categoryUrl: string;
  @Input() isHandset: boolean;

  constructor(private utils: UtilsService) {}

  ngOnInit() {}

  openSignup() {
    this.utils.openSignupDialog(this.isHandset);
  }
}
