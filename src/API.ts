/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CvData = {
  bucketName: string,
  objectKey: string,
  source: string,
  name?: string | null,
};

export type HrCvMutationMutationVariables = {
  cvData?: CvData | null,
};

export type HrCvMutationMutation = {
  hrCvMutation?: string | null,
};

export type HrCvQueryQueryVariables = {
  cvData?: CvData | null,
};

export type HrCvQueryQuery = {
  hrCvQuery?: string | null,
};
