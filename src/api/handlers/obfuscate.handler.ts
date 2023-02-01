import {ipcMain} from "electron";
import { IpcChannels } from '../ipc-channels';
import {obfuscateService} from "../../main/services/ObfuscateService";
import { Response } from '../Response';

ipcMain.handle(IpcChannels.OBFUSCATE_RUN, async (_event) => {

});


ipcMain.handle(IpcChannels.OBFUSCATE_PREVIEW, async (_event, input: Array<string>) => {
  try {
    const map = await obfuscateService.obfuscatePreview(input);
    return Response.ok({ message: 'Preview generated successfully :)', data: map })
  } catch (e) {
    return Response.fail({message: 'Cannot generate preview'});
  }
});
