import { Component, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Observable, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { setImageNumber, setTimer } from '../state/timer.actions';
import { getImageNumber, getTimer } from '../state/timer.selector';
import { TimerState } from '../state/timer.state';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})

export class TimerComponent implements OnInit,OnDestroy{

  imageNumber$: Observable<number> = this.store.select(getImageNumber);
  timer$: Observable<number> = this.store.select(getTimer);
  timerDestroy$ = new Subject();  //initial değeri olmaması lazım
  timerPause: boolean = false;

  constructor(private store: Store<{ timer: TimerState }>) {}

  ngOnInit() {
    //  this.store.dispatch(setImageUrl({value:"2"}));
  }
    backgroundImage$ = this.imageNumber$.pipe(
      map((value) => `/assets/background-image/${value}.jpg`)
    );

  startTimer() {
    this.timerDestroy$.next();
    this.timer$
      .pipe(
        take(1), //timer'da artış gerçekleşmiyor çünkü take(1) kullandım.1 kere subscribe olmayı sağlar
        switchMap((timerValue) => //stream değiştirmek istediğim için switchMap kullandım
          interval(1000).pipe(map((interval) => interval + timerValue))
        ),
        takeUntil(this.timerDestroy$) //timer'ı durdurabilmek için(filtrelemek için)
      )
      .subscribe((value) => this.store.dispatch(setTimer({ value }))); //timer değerini güncelleme işlemi

  }
  pauseTimer() {
    this.timerPause = !this.timerPause;
    if (this.timerPause) {
      this.timerDestroy$.next(); //next dediğim için yukarıdaki subscription'ı bitirdi.
    } else {
      this.startTimer(); //timer'ın kaldığı değerden itibaren çalışıyor,oradan itibaren toplayarak devam ediyor
    }
  }

  stopTimer(){
    this.timerDestroy$.next(); //timerdestroy bir akış gerçekleştiriyorum next ile
    this.store.dispatch(setTimer({ value:0 })); //setTimer aksiyonunu dispatch ederek store'da tuttuğum değeri sıfırlıyorum
    this.imageNumber$.pipe(take(1)).subscribe(imageNumber => this.store.dispatch(setImageNumber( { value: this.getNumber(imageNumber)})) ) //state'teki background'ı güncelleme işlemi

  }
  getNumber(currentNumber){ //background'ı değiştirdiğimde üst üste aynı resim gelmesin diye(rekürsif fonksiyon)
    const randomNumber = Math.floor(Math.random() * 4) + 1 ;
    if(currentNumber == randomNumber){ // oluşturduğu değeri döner,dönebileceği random bir değer bulana kadar devam eder
      return this.getNumber(currentNumber);
    }
      return randomNumber;
  }

  ngOnDestroy(){
    this.timerDestroy$.next();//her subscribe'ın bir unsubscribe'ı olmalıdır!
    //this.timerDestroy$.complete(); 
  }

}
