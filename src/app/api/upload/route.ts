import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from 'path'
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '@/amplifyconfiguration.json';


// Amplify.configure(config);
//  Amplify.configure({
//      ...Amplify.getConfig(),
//      Storage: {
//          S3: {
//              region: 'eu-west-1', // (required) - Amazon S3 bucket region
//              bucket: 'hr-ses-mail-received-tol' // (required) - Amazon S3 bucket URI
//          }
//      }
//    });
const client = generateClient();
const bucketName = process.env.BUCKET_NAME;
//const bucketName = 'hr-ses-mail-received-tol';
export async function POST(request: NextRequest) {
    console.log('Start POST bucketName', bucketName)
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const name: string | null = data.get('name') as unknown as string
    console.log('POST name [', name, ']')
    if (!file) {
        return NextResponse.json({ success: false});
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const path = join('/', 'tmp', file.name)
    await writeFile(path, buffer)

    console.log(`open ${path} to see uploaded file`)

    return NextResponse.json( {success: true, body: {filePath: path}})
}