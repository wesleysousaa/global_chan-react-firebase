import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage()
export default async function UploadImage(img, id) {

    const imageRef = ref(storage, "images-profile/" + id)

    await uploadBytes(imageRef, img).then((snapshot) => {
    })

    const url = await getDownloadURL(imageRef).then((url) => {
        return url
    })
    return url

}