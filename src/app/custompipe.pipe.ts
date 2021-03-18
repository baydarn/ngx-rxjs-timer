import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class CustompipePipe implements PipeTransform {

  transform(value: string, args?: any): any {

      const hours   = Math.floor(parseInt(value) / 3600)
      const minutes = Math.floor(parseInt(value) / 60) % 60
      const seconds = parseInt(value) % 60

      return [hours,minutes,seconds].map(value => value < 10 ? "0" + value : value)
                                    .join(":")

}
}


