import { Component, OnInit, Input } from '@angular/core';
import { MatDialogUtilsService } from '../../../shared/services';
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

  constructor(private matDialogUtils: MatDialogUtilsService) {}

  ngOnInit() {}

  openSignup() {
    this.matDialogUtils.openSignupDialog(this.isHandset);
  }
}
