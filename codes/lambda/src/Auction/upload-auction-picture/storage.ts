export type UploadPictureToStoragePort = (
  key: string,
  body: Buffer
) => Promise<string>;
