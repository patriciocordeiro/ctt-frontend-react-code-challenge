import { composeWithDevTools } from '@redux-devtools/extension';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk, ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ProductAction } from './product/product.types';
import rootReducer, { RootState } from './rootReducer';

export type AppAction = ProductAction;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AppAction
>;

export type AppDispatch = ThunkDispatch<RootState, undefined, AppAction>;

const composedEnhancer = composeWithDevTools(
  applyMiddleware<AppDispatch, RootState>(thunk)
);

const store = createStore(rootReducer, undefined, composedEnhancer);

export default store;
