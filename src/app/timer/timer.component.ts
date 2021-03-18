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
        take(1), //timer'da artış gerçekleşmiyor çünkü take(1) kullandık.1 kere subscribe olmayı sağlar
        switchMap((timerValue) => //stream değiştirmek istediğimiz için switchMap kullandık
          interval(1000).pipe(map((interval) => interval + timerValue))
        ),
        takeUntil(this.timerDestroy$)
      )
      .subscribe((value) => this.store.dispatch(setTimer({ value })));

  }
  pauseTimer(time) {
    this.timerPause = !this.timerPause;
    if (this.timerPause) {
      this.timerDestroy$.next(); //next dediğimiz için yukarıdaki subscription'ı bitirdi.takeUntil içine timerDestroy'u vermemiz
    } else {
      this.startTimer(); //timer'ın kaldığı değerden itibaren çalışıyor.oradan itibaren toplayarak devam ediyor
    }
  }

  stopTimer(){
    this.timerDestroy$.next(); //timerdestroy bir akış gerçekleştiriyorum next ile
    this.store.dispatch(setTimer({ value:0 })); //store'da tuttuğum değeri sıfırlıyorum setTimer aksiyonunu dispatch ederek
    this.imageNumber$.pipe(take(1)).subscribe(imageNumber => this.store.dispatch(setImageNumber( { value: this.getNumber(imageNumber)})) ) //state'te o background'ı güncelle diyoruz
    console.log("çalıştır")
  }
  getNumber(currentNumber){ //diyelimki 1.resim geldi.number random oluşturdum
    const randomNumber = Math.floor(Math.random() * 4) + 1 ;
    if(currentNumber == randomNumber){ // oluşturduğu değeri döner.dönebileceği random bir değer bulana kadar devam eder
      return this.getNumber(currentNumber);
    }
      return randomNumber;
  }

  ngOnDestroy(){
    this.timerDestroy$.next();
    this.timerDestroy$.complete();
  }

}
