import ImageKit from 'imagekit';
import Image from '../models/Image.js';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const uploadImage = async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await imagekit.upload({
            file: fileStr,
            fileName: 'upload.jpg',
            folder: '/uploads'
        });

        const newImage = new Image({
            url: uploadResponse.url,
            post: req.body.postId
        });

        await newImage.save();

        res.json({ url: uploadResponse.url });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Image upload failed', error });
    }
};