/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const hrCvQuery = /* GraphQL */ `query HrCvQuery($cvData: CvData) {
  hrCvQuery(cvData: $cvData)
}
` as GeneratedQuery<APITypes.HrCvQueryQueryVariables, APITypes.HrCvQueryQuery>;
