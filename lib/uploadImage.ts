import {ID, storage} from '@/appwrite';

const uploadImage = async(file:File)=>{
    if(!file) return;

    // let bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_IMAGES_BUCKET_ID!
    // console.log('the bucketID:>>>', bucketId);

    const fileUploaded = await storage.createFile(
        // Important: we must name the environment variables wit the prefix NEXT_PUBLIC_ so that they can be
        // accessible in the browser. For more info: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
        //->BucketID: copied from the images bucket from appwrite cloud storage: Personal Project/Trello-react/Storage/Buckets/
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_IMAGES_BUCKET_ID!,
        ID.unique(),
        file
    );

    return fileUploaded;
};

export default uploadImage;