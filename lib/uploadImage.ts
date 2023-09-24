import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;

  console.log("====>", process.env.BUCKET_ID);

  const fileUploaded = await storage.createFile(
    // process.env.BUCKET_ID!,

    process.env.BUCKET_ID!,
    ID.unique(),
    file
  );

  return fileUploaded;
};

export default uploadImage;
