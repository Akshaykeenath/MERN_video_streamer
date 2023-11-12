import { FireApp } from "config/firebase-config";
import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage(FireApp);

// Function to delete a file
export async function FirebaseDelete(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);

    return {
      status: "success",
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      status: "error",
      message: error.message,
    };
  }
}
