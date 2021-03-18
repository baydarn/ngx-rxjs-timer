import { setImageNumber , setTimer } from './timer.actions';
import { initialState } from './timer.state';
import { createReducer, on } from '@ngrx/store';


const _timerReducer = createReducer(
  initialState,
  on(setTimer,(state,action) => {
    return {
      ...state,
      timer: action.value,
    };
  }),
  on(setImageNumber , (state,action) => {
    return {
      ...state,
      imageNumber : action.value ,
    };
  })
);

export function timerReducer(state, action) {
  return _timerReducer(state, action);
}
