import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppState, AppDispatch } from '@/redux';

export type AppDispatchType = () => AppDispatch;
export const useAppDispatch: AppDispatchType  = useDispatch;

export type AppSelectorType = TypedUseSelectorHook<AppState>;
export const useAppSelector: AppSelectorType = useSelector;
