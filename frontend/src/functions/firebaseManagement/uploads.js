import { FireApp } from "config/firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(FireApp);

// Function to generate a unique name for the uploaded file
function generateUniqueFileName(file) {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(7);
  return `${timestamp}_${randomString}_${file.name}`;
}

export async function FirebaseUpload(file, path) {
  if (file) {
    try {
      // Generate a unique name for the file
      const uniqueFileName = generateUniqueFileName(file);
      const storagePath = `${path}${uniqueFileName}`; // Use the unique name for storage
      const storageRef = ref(storage, storagePath);

      const snapshot = await uploadBytes(storageRef, file);

      // Generate a public URL for the uploaded file
      const url = await getDownloadURL(storageRef);

      // console.log("File uploaded!", snapshot);
      // console.log("Public URL:", url);

      return {
        status: "success",
        message: url,
        storagePath: storagePath,
      };
    } catch (error) {
      console.error("Error:", error);

      return {
        status: "error",
        message: error.message,
      };
    }
  } else {
    return {
      status: "error",
      message: "No file selected",
    };
  }
}
