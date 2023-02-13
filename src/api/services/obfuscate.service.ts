import { PreviewDTO } from "@api/dto";
import { IpcChannels } from '../ipc-channels';
import { BaseService } from './base.service';

class ObfuscateService extends BaseService {
  public async obfuscatePreview(words: Array<string>): Promise<PreviewDTO> {
    const response = await window.electron.ipcRenderer.invoke(IpcChannels.OBFUSCATE_PREVIEW, words);
    return this.response(response);
  }


}

export const obfuscateService = new ObfuscateService();


