//import { SNS } from 'aws-sdk'
import { SNSClient } from "@aws-sdk/client-sns";
import { PublishCommand } from "@aws-sdk/client-sns";

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const responseDict = (statusCode = 200, message) => {
    if (!message) {
        message = 'Hello from Lambda!';
    }
    return {
        statusCode: statusCode,
        body: JSON.stringify(message),
    }
}

export const handler = async (event, context) => {
//exports.handler = async (event) => {
    console.log('<<<___S T A R T____L A M B D A___API_GQL___>>>')
    console.log(`EVENT: ${JSON.stringify(event)}`);
    let arg = ''
    if (event['arguments']) {
        console.log(`arguments: ${JSON.stringify(event['arguments'])}`);
        arg = JSON.stringify(event['arguments']);
        if (event['arguments']['cvData']) {
            const cvData = event['arguments']['cvData'];
            if (cvData['bucketName'] && cvData['objectKey'] && cvData['source'] && cvData['vacancy']) {
                //const sns = new AWS.SNS();
                const bucketName = cvData['bucketName'];
                const objectKey = cvData['objectKey'];
                const source = cvData['source'];
                const vacancy = cvData['vacancy'];
                const location = cvData['location'];
                const citizenship = cvData['citizenship'];
                const notes = cvData['notes'];
                if (!bucketName || !objectKey || !source || !vacancy || !citizenship || !location)  {
                    console.error('The [bucketName, objectKey, source, vacancy or citizenship] parameter(s) is/are empty, provide non-empty value')
                    console.log('<<<___F I N I S H____L A M B D A___API_GQL__ERROR___>>>')
                    return responseDict(400, `The bucketName [${bucketName}], objectKey [${objectKey}], source [${source}], location [${location}], vacancy [${vacancy} or citizenship [${citizenship}] parameter(s) is/are empty, provide non-empty value`)
                }

                const message = {
                    "receipt": {
                        "action": {
                            "bucketName": bucketName,
                            "objectKey": objectKey,
                        }
                    },
                    "mail": {
                        "source": source,
                        "destination": "hr@alliedtesting.careers",
                    },
                    location,
                    vacancy,
                    citizenship,
                    notes                    
                }
                const snsClient = new SNSClient({});
                const response = await snsClient.send(
                    new PublishCommand({
                      Message: JSON.stringify(message),
                      TopicArn: "arn:aws:sns:eu-west-1:074168154675:incoming-email-processing-tol-SesIncomingEmailEventTopic-DL3aj9EULs6U"
                    }),
                  );
                console.log(response);
                console.log(`bucketName [${bucketName}]', objectKey [${objectKey}], source [${source}], vacancy [${vacancy}], citizenship [${citizenship}], notes [${notes}]`)
                console.log('<<<___F I N I S H____L A M B D A___API_GQL___OK___>>>')
                return responseDict(200, 'Hello from Lambda 2!, arg ' + arg)
            }
        }
    }
    console.error(400, 'Invalid input data, arg: ' + arg)
    console.error('<<<___F I N I S H____L A M B D A___API_GQL__ERROR___>>>')
    return responseDict(400, 'Invalid input data, arg: ' + arg)
};
