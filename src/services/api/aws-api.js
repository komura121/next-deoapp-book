

const s3 = new AWS.S3({
    accesKeyid: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: proces.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
})

export default s3;