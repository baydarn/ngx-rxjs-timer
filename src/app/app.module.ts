import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { timerReducer } from './state/timer.reducer';
import { TimerComponent } from './timer/timer.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { environment } from '../environments/environment';
import { CustompipePipe } from './custompipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    CustompipePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({timer:timerReducer}),
    EffectsModule.forRoot([]),
    TooltipModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
