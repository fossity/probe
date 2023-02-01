import { IpcChannels } from '../ipc-channels';
import { BaseService } from './base.service';

class ObfuscateService extends BaseService {
  public async obfuscatePreview(words: Array<string>): Promise<Map<string, string|null>> {
    const response = await window.electron.ipcRenderer.invoke(IpcChannels.OBFUSCATE_PREVIEW, words);
    return this.response(response);
  }

  //TODO: Implement persistent obfuscation
  public async obfuscateRun(words: Array<string>): Promise<boolean> {
    const response = await window.electron.ipcRenderer.invoke(IpcChannels.OBFUSCATE_RUN, words);
    return this.response(response);
  }

}

export const obfuscateService = new ObfuscateService();


