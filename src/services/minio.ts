import { minioClient } from "../config/minio.ts";
import { env } from "../schemas/env.ts";

export type MinioResponse = {
  success: boolean;
  message: string;
  data: any[] | { link: string }[];
};

export const urlImgProduct = (bucket: string, path: string) => {
  return {
    success: true,
    message: "Link da imagem retornado!",
    data: [
      {
        link: `https://${env.MINIO_ENDPOINT}/marketplace-ux/${path}`,
      },
    ],
  } as MinioResponse;
};

export const uploadImg = async (
  bucket: string,
  path: string,
  fileBuffer: Buffer<ArrayBufferLike>,
  fileSize: number
) => {
  await minioClient.putObject(bucket, path, fileBuffer, fileSize);
};
