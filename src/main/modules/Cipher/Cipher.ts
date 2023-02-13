import fs from 'fs';
import crypto from 'crypto'
import * as buffer from "buffer";

export class Cipher {
  private AES_key: Buffer;
  private AES_IV: Buffer;

  private RSA_pub_key: string;


  constructor(publicKey: string) {
    this.RSA_pub_key = publicKey;
  }

  private generateAES128params() {
    const AESkey = crypto.randomBytes(16);
    const AESiv = crypto.randomBytes(16);

    this.AES_key = AESkey;
    this.AES_IV = AESiv;

    return {AESkey, AESiv};
  }

  //WARNING: This function will not cipher data longer than 128 bytes.
  //The current implementation of this class uses RSA 2048 bits so, cipherContentRSA() will not encrypt data longer than 128 bytes!!
  private cipherContentRSA(plaintext: Buffer, pubKey: string): Buffer {
    return crypto.publicEncrypt({key: pubKey, padding: crypto.constants.RSA_PKCS1_PADDING}, plaintext);
  }


  private longToByteArray (long: number): Array<number> {
    // we want to represent the input as a 8-bytes array
    const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for ( let index = 0; index < byteArray.length; index ++ ) {
      // eslint-disable-next-line no-bitwise
      const byte = long & 0xff;
      byteArray [ index ] = byte;
      // eslint-disable-next-line no-param-reassign
      long = (long - byte) / 256 ;
    }

    return byteArray;
  };


  private cipherContent_AES128_CBC(textPlainData: Buffer, key: Buffer, iv: Buffer): Buffer {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return Buffer.concat([cipher.update(textPlainData), cipher.final()])
  }


  // Here a hybrid scheme is used to cipher the data.
  // Simetric: AES-CBC-128
  // Assimetric: RSA-2048, PKCS1
  public cipherFossityPackage(data: Buffer): Buffer {
    const {AESkey, AESiv} = this.generateAES128params();
    const AESKeyCiphered = this.cipherContentRSA(AESkey, this.RSA_pub_key);
    const size = Buffer.from(this.longToByteArray(data.length));

    const header = Buffer.concat([size,AESKeyCiphered,AESiv])
    const cipherText = this.cipherContent_AES128_CBC(data, AESkey, AESiv);

    const packageQi = Buffer.concat([header, cipherText]);
    return packageQi;
  }

  public generateDecrypBash(scriptName: string, fossityPackageName: string) {
    return  `!#/bin/bash
# You can use this script to decrypt the packet and review the content.
# Please be careful with this script as it contains the keys to open the .fossity package.
# Usage ./${scriptName}.sh

dd iflag=skip_bytes if=${fossityPackageName}.fossity of=${fossityPackageName}.enc skip=280 bs=1M #Removes first 280 bytes from the fossity package
openssl aes-128-cbc -d -in ${fossityPackageName}.enc -out ${fossityPackageName}.zip -iv ${this.AES_IV.toString('hex')} -K ${this.AES_key.toString('hex')}

rm ${fossityPackageName}.enc
    `}

}
