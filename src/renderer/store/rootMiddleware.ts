import { createListenerMiddleware, current, isAnyOf } from '@reduxjs/toolkit';
import { RootState } from '@store/rootReducer';

export const rootMiddleware = createListenerMiddleware();
