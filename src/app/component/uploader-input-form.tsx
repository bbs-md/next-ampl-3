'use client'

import { Button, Upload, Input, Form, message, Space, Typography, Progress, Spin, Select, Checkbox, ConfigProvider } from 'antd'
const { TextArea } = Input;
import axios from 'axios'
import { saveDataToS3, sendCvDataByGrapgQl } from '@/app/actions'
import React, {useState, useEffect} from 'react'

import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';
import '@/app/upload.css'
import { CheckboxChangeEvent } from 'antd/es/checkbox';
Amplify.configure(config, {
    ssr: true // required when using Amplify with Next.js
});

const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

export default function UploadForm(props: any) {

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [file, setfile] = useState<File>()
    const [showMessage, setShowMessage] = useState<boolean>(false)
    const [check, setCheck] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<string>('')
    const [vacancy, setVacancy] = useState<string>('Software Developer')
    const [office, setOffice] = useState<string>('moldova')
    const [spin, setSpin] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [mes, setMes] = useState<string>('')

    useEffect(() => {
            console.log('useEffect changed file');
    }, [file]);

    const handleFileUpload = (file: any) => {
        console.log('Start handleFileUpload file1 ', file.file.name)
        setfile(file.file)
        setShowMessage(false)
        setProgress(0)
        const submitButton = document.getElementById('submin-form');
    }
    
    const onFinish = async (values: any) => {
        console.log('Start onFinish, Received values of form: ', values);
        setProgress(0);
        setMes('');
        if (values) {
            let citizenship = values?.citizenship;
            let notes = values?.notes;
            console.log('vacancy: ', vacancy)
            console.log('office: ', office)
            console.log('citizenship: ', citizenship)
            console.log('notes: ', notes)
            if (file) {
                const data = new FormData()
                data.set('file', file)
                setSpin(true)
                try {
                    const uploadResponseDict =await axios.post('/api/upload', data, {
                        onUploadProgress(progressEvent) {
                            if (progressEvent.progress) {
                                let prog = Math.ceil(progressEvent.progress * 100);
                                setProgress(prog)
                                console.log('progress', progress, prog)
                            }                            
                            console.log('UploadForm progressEvent', progressEvent)
                        },
                    });
                    console.log('uploadResponseDict >>>', uploadResponseDict)
                    const filePath: string = uploadResponseDict.data.body.filePath;
                    console.log(`The [${filePath}] file was saved`)
                    const saveDataToS3Response = await saveDataToS3(filePath);
                    console.log('fileNameData ', saveDataToS3Response);

                    
                    const objectKey = saveDataToS3Response[0];
                    const bucketName = saveDataToS3Response[1];
                    let cvDataDict: {} = {location: office, vacancy, citizenship, notes, objectKey, bucketName, source: 'alliedtesting.com'}
                    const sendCvDataByGrapgQlResponse = await sendCvDataByGrapgQl(filePath, cvDataDict)
                    console.log('sendCvDataByGrapgQlResponse ', sendCvDataByGrapgQlResponse)
                    const responseFileName = sendCvDataByGrapgQlResponse['fileName'];
                    if (responseFileName) {
                        //setMessage(`Data and the [${file.name}] file were uploaded`)
                    }

                    setSpin(false)
                    setMes('data has been downloaded and is being processed')
                }
                catch(error) {
                    console.log("Submit form error: ", error);
                    setMes('Failed to submit form data'); 
                    messageApi.info('Failed to submit form data');                
                    setShowMessage(true)
                }
                setSpin(false)
            }
            else {
                setShowMessage(true)
                messageApi.info('Select the file, please');
            }            
        }
      };

    const onRequiredTypeChange = ( requiredMarkValue: any ) => {
        console.log('onRequiredTypeChange requiredMarkValue ', requiredMarkValue)
      };
    
    const handleVacancyChange = (value: string) => {
        setVacancy(value)
        console.log(`selected ${value}`);
    };

    const handleOfficeChange = (value: string) => {
        setOffice(value)
        console.log(`selected ${value}`);
    };

      

    const  onChangeUplod = (event: CheckboxChangeEvent) => {
        console.log('Styat onChangeUplod')
    };

    const onChangeCheckbox = (event: CheckboxChangeEvent) => {
        setCheck(!check)
    };

    return (<ConfigProvider
        theme={{
          token: {
            // Seed Token
            fontSize: 18,
            fontFamily: 'Arial'
          },
        }}
      >
    <><div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                    marginTop: '100px',
                    height: '200px',
                }}>
    <Form
        onValuesChange={onRequiredTypeChange}
  
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={false}
        style={{ maxWidth: 1600 }}
      
      > 
        <div className='container'>
        <div className='col retro'>
            <Form.Item
                name="vacancy"
                label="Vacancy"
                tooltip="Add vacancy"
                style={{ width: 750 }}
                rules={[{ required: false, message: 'Please input Add vacancy!', whitespace: true }]}>
                    <Select
                        size='large'
                        defaultValue={vacancy}
                        style={{ width: 350 }}
                        onChange={handleVacancyChange}
                        options={[
                            { value: 'Software Developer', label: 'Software Developer' },
                            { value: 'Software Tester', label: 'Software Tester' },
                            { value: 'Test Automation Engineer', label: 'Test Automation Engineer' },
                            { value: 'Performance Test Engineer', label: 'Performance Test Engineer' }
                        ]}
                    />
            </Form.Item>
            <Form.Item
                name="office"
                label="Office"
                tooltip="Select the office, please"
                style={{ width: 750 }}
                rules={[{ required: false, message: 'Select the office, please', whitespace: true }]}
                >
                <Select
                    size='large'
                    defaultValue={office}
                    style={{ width: 350 }}
                    onChange={handleOfficeChange}
                    options={[
                        { value: 'moldova', label: 'Moldova' },
                        { value: 'serbia', label: 'Serbia' },
                        { value: 'romania', label: 'Romania' }
                    ]}
                />
            </Form.Item>
            <Form.Item
                name="citizenship"
                label="Citizenship"
                tooltip="Select citizenship"
                style={{ width: 750 }}
                rules={[{ required: true, message: 'Please select your citizenship!', whitespace: true }]}>
                    <Select
                        size='large'
                        defaultValue="--"
                        style={{ width: 350 }}
                        //onChange={handleChange}
                        options={[
                            { value: '--', label: '--' },
                            { value: 'EU', label: 'EU' },
                            { value: 'non-EU', label: 'non-EU' },
                            { value: 'dual (incl. EU)', label: 'dual (incl. EU)' }
                        ]}
            />
        </Form.Item>
        </div>
        <div className='col retro'>
            <Form.Item
                name="notes"
                label="Notes"
                tooltip="Enter your notes"
                style={{ width: 750 }}
                rules={[{ required: false, message: 'Please input your nickname!', whitespace: true }]}>
            <TextArea rows={4} />
        </Form.Item>
        <Form.Item 
            label="Upload"
            name="upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            style={{ width: 750 }}
             rules={[{ required: !file, message: 'Please select the file', whitespace: true }]}
            >
                {contextHolder}
        
            <Upload 
                //action="/api/upload"
                listType="picture-card"
                customRequest={handleFileUpload}
                showUploadList={false}
                accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .wmv"
            >
                <div className='upload'>
                    <div style={{ marginTop: 8 }}>Select file</div>
                </div>
                {/* <Button>Select the file</Button> */}
            </Upload>
        { file ? <Space direction="vertical" ><Space style={{ backgroundColor: "0,0,0,0.05", width: 500, padding: 8}}>
            
            <Typography>{file.name}</Typography>
        </Space>
        {progress ? <Progress percent={progress} /> : null}
        </Space>
        : null}
        
        
        </Form.Item>
        </div>
      </div> 
      <div className='checkbox'>
        <Checkbox onChange={onChangeCheckbox}>By submitting CV you agree with our <a href="https://www.alliedtesting.com/privacy-policy/" target='_blaank'>Privacy Policy</a></Checkbox>
      </div> 
      <br/>
         
      <Form.Item>
        {check ? <Button type="primary" htmlType="submit" id="submin-form">Submit</Button> :
        <Button type="primary" htmlType="submit" id="submin-form" disabled>Submit</Button>}
        <div><Spin spinning={spin}/></div>
        {mes ? <div className='message'>{mes}</div> : null}
      </Form.Item> 
      </Form>      

    </div></></ConfigProvider>)
}