import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scoreLoanApplication } from '../src/services/loanMlScoringService.js';

const applicationData = {
  code_gender: 'F',
  name_income_type: 'Commercial associate',
  name_education_type: 'Higher education',
  name_family_status: 'Single / not married',
  occupation_type: 'Sales staff',
  flag_own_car: 'Y',
  flag_own_realty: 'N',
  cnt_children: 1,
  cnt_fam_members: 2,
  amt_income_total: 6000000,
  amt_credit: 7000000,
  amt_annuity: 650000,
  amt_goods_price: 7000000,
  days_birth: -11000,
  days_employed: -900,
  days_last_phone_change: -180,
  ext_source_1: 0.58,
  ext_source_2: 0.64,
  ext_source_3: 0.69,
};

const prediction = {
  ai_recommendation: 'LAYAK',
  risk_level: 'LOW',
  prob_default: 0.35,
  threshold: 0.66608,
  confidence: 0.47,
  model_name: 'XGBoost',
  model_version: 'koopcare-xgboost-v1',
  human_review_required: true,
  final_decision: null,
  note: 'AI recommendation only.',
};

const jsonResponse = (body) => new Response(
  JSON.stringify(body),
  { headers: { 'Content-Type': 'application/json' } },
);

test('scoreLoanApplication calls ML API, maps the prediction, and saves an assessment record', async () => {
  const savedRecords = [];
  let capturedRequest = null;

  const result = await scoreLoanApplication({
    loanId: 7,
    applicationData,
    saveAiAssessment: async (record) => {
      savedRecords.push(record);
    },
    mlClientOptions: {
      baseUrl: 'http://ml-api.test',
      fetchImpl: async (url, options) => {
        capturedRequest = {
          url,
          method: options.method,
          body: JSON.parse(options.body),
        };
        return jsonResponse(prediction);
      },
    },
  });

  assert.equal(capturedRequest.url, 'http://ml-api.test/predict');
  assert.equal(capturedRequest.method, 'POST');
  assert.equal(capturedRequest.body.amt_credit, 7000000);
  assert.equal(result.assessment.eligibility_score, 65);
  assert.equal(savedRecords.length, 1);
  assert.equal(savedRecords[0].loan_id, 7);
  assert.equal(savedRecords[0].eligibility_score, 65);
});
