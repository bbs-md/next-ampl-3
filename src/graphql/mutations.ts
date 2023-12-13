/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const hrCvMutation = /* GraphQL */ `mutation HrCvMutation($cvData: CvData) {
  hrCvMutation(cvData: $cvData)
}
` as GeneratedMutation<
  APITypes.HrCvMutationMutationVariables,
  APITypes.HrCvMutationMutation
>;
