import {storage} from '@/appwrite';
// this helper functions uses the storage and gets the url of the todo's image
//  to be displayed in the TodoCard component.

const getUrl = async (image: Image)=>{
    const url = storage.getFilePreview(image.bucketId, image.fileId);

    return url;
}

export default getUrl;