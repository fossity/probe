import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProject } from '@api/types';
import { fetchProjects } from '@store/workspace-store/workspaceThunks';
import { RootState } from '@store/rootReducer';
import { IScan } from '@context/types';
import { NewProjectDTO } from '@api/dto';

export interface WorkspaceState {
  loading: boolean;
  projects: IProject[];
  currentProject: IProject;
  newProject: NewProjectDTO;
  scanPath: IScan;
  obfuscateList: string[],

}

const initialState: WorkspaceState = {
  loading: false,
  projects: null,
  currentProject: null,
  newProject: {
    name: '',
    scan_root: '',
    projectInfo: {
      default_license: 'proprietary',
      contact: { },
    },
  },
  scanPath: null,
  obfuscateList: null,
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setNewProject: (state, action: PayloadAction<NewProjectDTO>) => {
      state.newProject = action.payload;
    },
    setScanPath: (state, action: PayloadAction<IScan>) => {
      state.scanPath = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<IProject>) => {
      state.currentProject = action.payload
    },
    setObfuscateList: (state, action: PayloadAction<string[]>) => {
      state.obfuscateList = action.payload;
    },
    clean: (state) => {
      state.newProject = initialState.newProject;
      state.obfuscateList = null;
    }
  },
  extraReducers: {
    [fetchProjects.pending.type]: (state) => ({ ...state, loading: true }),
    [fetchProjects.fulfilled.type]: (state, action: PayloadAction<IProject[]>) => ({
      ...state,
      loading: false,
      projects: action.payload,
    }),
    [fetchProjects.rejected.type]: (state) => ({ ...state, loading: false }),
  },
});

// actions
export const { setNewProject, setScanPath, setCurrentProject, setObfuscateList, clean } = workspaceSlice.actions;

// selectors
export const selectWorkspaceState = (state: RootState) => state.workspace;

export default workspaceSlice.reducer;
