export class EncoderDecoder {
  private _targetToDecodeOrEncode: string;

  constructor(targetToDecodeOrEncode: string) {
    this._targetToDecodeOrEncode = targetToDecodeOrEncode;
  }

  decodeBase64String() {
    return Buffer.from(this._targetToDecodeOrEncode, "base64").toString(
      "ascii",
    );
  }

  encodeStringToBase64() {
    return Buffer.from(this._targetToDecodeOrEncode).toString("base64");
  }
}
