import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  InvalidMlProbabilityError,
  MissingMlPayloadFieldError,
  buildLoanAiAssessmentRecord,
  buildPredictionPayload,
  calculateEligibilityScore,
} from '../src/services/loanAiMappingService.js';

const validApplicationData = {
  code_gender: 'M',
  name_income_type: 'Working',
  name_education_type: 'Secondary / secondary special',
  name_family_status: 'Married',
  occupation_type: 'Laborers',
  flag_own_car: 'N',
  flag_own_realty: 'Y',
  cnt_children: '0',
  cnt_fam_members: '2',
  amt_income_total: '4500000',
  amt_credit: '5000000',
  amt_annuity: '450000',
  amt_goods_price: '5000000',
  days_birth: '-12000',
  days_employed: '-1200',
  days_last_phone_change: '-300',
  ext_source_1: '0.52',
  ext_source_2: '0.61',
  ext_source_3: '0.73',
};

const validPrediction = {
  ai_recommendation: 'LAYAK',
  risk_level: 'LOW',
  prob_default: 0.23,
  threshold: 0.66608,
  confidence: 0.65,
  model_name: 'XGBoost',
  model_version: 'koopcare-xgboost-v1',
  human_review_required: true,
  final_decision: null,
  note: 'AI recommendation only.',
};

test('buildPredictionPayload validates required fields and coerces numeric values', () => {
  const payload = buildPredictionPayload(validApplicationData);

  assert.equal(payload.code_gender, 'M');
  assert.equal(payload.cnt_children, 0);
  assert.equal(payload.amt_credit, 5000000);
  assert.equal(payload.ext_source_3, 0.73);
});

test('buildPredictionPayload reports missing ML fields clearly', () => {
  const incompleteData = { ...validApplicationData };
  delete incompleteData.ext_source_2;

  assert.throws(
    () => buildPredictionPayload(incompleteData),
    (error) => {
      assert.ok(error instanceof MissingMlPayloadFieldError);
      assert.deepEqual(error.missingFields, ['ext_source_2']);
      return true;
    },
  );
});

test('calculateEligibilityScore converts default risk into higher-is-better eligibility score', () => {
  assert.equal(calculateEligibilityScore(0), 100);
  assert.equal(calculateEligibilityScore(0.23), 77);
  assert.equal(calculateEligibilityScore(1), 0);
});

test('calculateEligibilityScore rejects invalid probability values', () => {
  assert.throws(
    () => calculateEligibilityScore(1.2),
    InvalidMlProbabilityError,
  );
});

test('buildLoanAiAssessmentRecord stores request and response payloads for audit trail', () => {
  const requestPayload = buildPredictionPayload(validApplicationData);
  const scoredAt = new Date('2026-05-15T00:00:00.000Z');
  const record = buildLoanAiAssessmentRecord({
    loanId: 42,
    requestPayload,
    prediction: validPrediction,
    scoredAt,
  });

  assert.equal(record.loan_id, 42);
  assert.equal(record.eligibility_score, 77);
  assert.equal(record.scored_at, scoredAt);
  assert.deepEqual(JSON.parse(record.request_payload_json), requestPayload);
  assert.deepEqual(JSON.parse(record.response_payload_json), validPrediction);
});
