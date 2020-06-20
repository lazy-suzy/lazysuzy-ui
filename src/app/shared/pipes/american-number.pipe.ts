import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'americanNumber'
})
export class AmericanNumberPipe implements PipeTransform {
  transform(tel, args) {
    if (tel) {
      const value = tel.toString().trim().replace(/^\+/, '');

      if (value.match(/[^0-9]/)) {
        return tel;
      }

      let country;
      let city;
      let no;

      switch (value.length) {
        case 10: // +1PPP####### -> C (PPP) ###-####
          country = 1;
          city = value.slice(0, 3);
          no = value.slice(3);
          break;

        case 11: // +CPPP####### -> CCC (PP) ###-####
          country = value[0];
          city = value.slice(1, 4);
          no = value.slice(4);
          break;

        case 12: // +CCCPP####### -> CCC (PP) ###-####
          country = value.slice(0, 3);
          city = value.slice(3, 5);
          no = value.slice(5);
          break;

        default:
          return tel;
      }

      if (country === 1) {
        country = '';
      }

      no = no.slice(0, 3) + '-' + no.slice(3);

      return (country + ' (' + city + ') ' + no).trim();
    }
  }
}
