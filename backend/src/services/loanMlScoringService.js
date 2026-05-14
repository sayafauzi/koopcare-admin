import { predictCreditRisk } from './mlScoringClient.js';
import {
  buildLoanAiAssessmentRecord,
  buildPredictionPayload,
  mapPredictionToLoanAiAssessment,
} from './loanAiMappingService.js';

export const scoreLoanApplication = async ({
  loanId,
  applicationData,
  saveAiAssessment = null,
  mlClientOptions = {},
}) => {
  const requestPayload = buildPredictionPayload(applicationData);
  const prediction = await predictCreditRisk(requestPayload, mlClientOptions);
  const assessment = mapPredictionToLoanAiAssessment(prediction);

  if (typeof saveAiAssessment !== 'function') {
    return {
      requestPayload,
      prediction,
      assessment,
    };
  }

  const assessmentRecord = buildLoanAiAssessmentRecord({
    loanId,
    requestPayload,
    prediction,
  });

  await saveAiAssessment(assessmentRecord);

  return {
    requestPayload,
    prediction,
    assessment,
    assessmentRecord,
  };
};
