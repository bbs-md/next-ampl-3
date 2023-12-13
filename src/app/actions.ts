'use server'

import { readFile } from "fs/promises";
import { generateClient } from 'aws-amplify/api';
import { hrCvMutation } from "@/graphql/mutations";

import { uploadData } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';
Amplify.configure(config);
const client = generateClient();
//const bucketName = 'hr-ses-mail-received-tol';
const bucketName = process.env?.BUCKET_NAME ? process.env?.BUCKET_NAME : 'hr-ses-mail-received-tol';
Amplify.configure(config, {
    ssr: true // required when using Amplify with Next.js
});

export async function sendCvDataByGrapgQl(filePath: string, cvData: {[key:string]: string}): Promise<{[key:string]: string}> {
    let message = ''
    try {
        const fileContent = await readFile(filePath)
        if (filePath) {
            const fileName = filePath.split('/').pop();
            console.log('[sendCvDataByGrapgQl] Got fileName [', fileName, ']');
            console.log('[sendCvDataByGrapgQl] Got hrCvMutation [', hrCvMutation, ']');
            console.log('[sendCvDataByGrapgQl] Got cvData [', cvData, ']')
            if (fileName) {
                const apiData = await client.graphql({ query: hrCvMutation, variables: { 
                    cvData: {
                      bucketName: bucketName,
                      objectKey: `public/${fileName}`,
                      source: "alliedtesting.com",
                      location: cvData.location,
                      vacancy: cvData.vacancy,
                      citizenship: cvData.citizenship,
                      notes: cvData.notes,
                    }
                },
                //authMode: 'iam'
                });
           console.log('graphql apiData >>> ', apiData)
            return {fileName: fileName}
            }            
        } 
        else {
            message = '[sendCvDataByGrapgQl] filePath is empty'
        }       
   } catch (error) {
       console.log('Failed sent message to sns: ', error);
       message = 'sendCvDataByGrapgQl Error';
   }
   return {message}
}


export async function saveDataToS3(filePath: string): Promise<[string, string]> {
    const ss = process.env?.secrets?['MY_TOL_SECRET'] : null;
    const ss4 = process.env?.secrets;
    const ss1 = process.env['MY_TOL_SECRET'];
    const ss3= process.env['AMPLIFY_function_incomingGraphQLRequestProcessing_deploymentBucketName'];
    
    console.log('ss >>>', ss)
    console.log('ss1 >>>', ss1)
    console.log('ss2 >>>', process.env.secrets)
    console.log('ss3 >>>', ss3)
    console.log('ss4 >>>', ss4)
    try {
        const fileContent = await readFile(filePath)
        const fileName = filePath.split('/').pop();
        console.log('[saveDataToS3] Got fileName [', fileName, ']')
        if (fileName) {
            const result = await uploadData({
                key: fileName,
                data: fileContent,
            }).result;
            console.log('Succeeded uploadData to s3: ', result);
            return [`public/${fileName}`, bucketName]
        }
        
   } catch (error) {
       console.log('Failed to uploadData to s3: ', error);
   }
   return ['', '']
}