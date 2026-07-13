import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3 = new S3Client({
    region: "us-east-1"
});


export const handler = async (event) => {

    try {

        const bucket = event.Records[0].s3.bucket.name;

        const key = decodeURIComponent(
            event.Records[0].s3.object.key.replace(/\+/g, " ")
        );


        console.log("Original File:", key);


        // Get original image from S3
        const response = await s3.send(
            new GetObjectCommand({
                Bucket: bucket,
                Key: key
            })
        );


        // Convert stream to buffer
        const imageBuffer = await streamToBuffer(response.Body);


        // Resize image
        const resizedBuffer = await sharp(Buffer.from(imageBuffer))
            .resize({
                width: 300
            })
            .jpeg({
                quality: 80
            })
            .toBuffer();


        console.log("Buffer created:", Buffer.isBuffer(resizedBuffer));


        // Extract only filename
        const fileName = key.split("/").pop();


        // Create resized filename
        const resizedFileName = fileName.replace(
            /\.[^/.]+$/,
            ".jpg"
        );


        const resizedKey = `resized/${resizedFileName}`;


        console.log("Uploading:", resizedKey);


        // Upload resized image
        await s3.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: resizedKey,
                Body: resizedBuffer,
                ContentType: "image/jpeg"
            })
        );


        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Image resized successfully",
                file: resizedKey
            })
        };


    } catch (error) {

        console.error("Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Image resize failed",
                error: error.message
            })
        };

    }

};



// Convert S3 stream to Buffer
async function streamToBuffer(stream) {

    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(chunk);
    }

    return Buffer.concat(chunks);

}