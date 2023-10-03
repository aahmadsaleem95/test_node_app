import Bucket from "backblaze-b2";

// aws-sdk
//

export async function commonConnection() {
  try {
    const b2 = new Bucket({
      applicationKey: `${process.env.ApplicationKey}`,
      applicationKeyId: `${process.env.ApplicationKeyId}`,
    });
    await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
    // get upload url and authorizationToken
    const urlData = await b2.getUploadUrl({
      bucketId: `${process.env.BucketId}`,
    });
    return {
      uploadUrl: urlData.data.uploadUrl,
      uploadAuthToken: urlData.data.authorizationToken,
      bucket: b2,
    };
  } catch (error) {
    return error;
  }
}

export async function uploadImage(req: any) {
  try {
    const urlData: any = await commonConnection();
    const b2 = urlData.bucket;
    const response = await b2.uploadFile({
      uploadUrl: urlData.uploadUrl,
      uploadAuthToken: urlData.uploadAuthToken,
      mime: req.files[0].mimetype,
      fileName: new Date().getTime() + "-" + req.files[0].originalname,
      data: req.files[0].buffer,
      onUploadProgress: (event: any) => {},
    });
    const filePath = `${process.env.ImageStaticUrl}` + response.data.fileName;
    return { path: filePath, fileId: response.data.fileId };
  } catch (error) {
    return error;
  }
}

export async function deleteImage(fileId: any, fileName: any) {
  try {
    const urlData: any = await commonConnection();
    const b2 = urlData.bucket;
    const deleteData = await b2.deleteFileVersion({
      fileId: fileId,
      fileName: fileName,
      // ...common arguments (optional)
    });
    return deleteData.data;
  } catch (error) {
    return error;
  }
}
