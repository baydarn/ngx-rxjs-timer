import { createAction,props } from '@ngrx/store';

export const setTimer = createAction('[Timer] setTimer',props<{value: number}>());

export const setImageNumber  = createAction('[Image] setImage', props<{value: number}>());
