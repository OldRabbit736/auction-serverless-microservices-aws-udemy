export type UploadPictureToStoragePort = (
  key: string,
  body: Buffer
) => Promise<any>;
