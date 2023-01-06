import { combineReducers } from '@reduxjs/toolkit';
import workspaceReducer from './workspace-store/workspaceSlice';
import navigationReducer from './navigation-store/navigationSlice';

const rootReducer = combineReducers({
  workspace: workspaceReducer,
  navigation: navigationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
