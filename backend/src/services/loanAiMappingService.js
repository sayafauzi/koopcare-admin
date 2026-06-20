export class MissingMlPayloadFieldError extends Error {
  constructor(missingFields) {
    super(`Missing ML payload fields: ${missingFields.join(', ')}`);
    this.name = 'MissingMlPayloadFieldError';
    this.missingFields = missingFields;
  }
}

export class InvalidMlProbabilityError extends Error {
  constructor(probDefault) {
    super(`Invalid ML probability value: ${probDefault}`);
    this.name = 'InvalidMlProbabilityError';
    this.probDefault = probDefault;
  }
}

export const REQUIRED_ML_REQUEST_FIELDS = [
  'code_gender',
  'name_income_type',
  'name_education_type',
  'name_family_status',
  'occupation_type',
  'flag_own_car',
  'flag_own_realty',
  'cnt_children',
  'cnt_fam_members',
  'amt_income_total',
  'amt_credit',
  'amt_annuity',
  'amt_goods_price',
  'days_birth',
  'days_employed',
  'days_last_phone_change',
  'ext_source_1',
  'ext_source_2',
  'ext_source_3',
];

export const ML_RESPONSE_STORAGE_FIELDS = [
  'ai_recommendation',
  'risk_level',
  'prob_default',
  'threshold',
  'confidence',
  'model_name',
  'model_version',
  'human_review_required',
  'final_decision',
  'note',
];

const isMissing = (value) => (
  value === undefined
  || value === null
  || value === ''
  || (typeof value === 'number' && Number.isNaN(value))
);

const assertRequiredPayloadFields = (payload) => {
  const missingFields = REQUIRED_ML_REQUEST_FIELDS.filter((field) => isMissing(payload[field]));

  if (missingFields.length > 0) {
    throw new MissingMlPayloadFieldError(missingFields);
  }
};

const toNumber = (value) => Number(value);

export const buildPredictionPayload = (applicationData) => {
  assertRequiredPayloadFields(applicationData);

  const payload = {
    code_gender: applicationData.code_gender,
    name_income_type: applicationData.name_income_type,
    name_education_type: applicationData.name_education_type,
    name_family_status: applicationData.name_family_status,
    occupation_type: applicationData.occupation_type,
    flag_own_car: applicationData.flag_own_car,
    flag_own_realty: applicationData.flag_own_realty,
    cnt_children: toNumber(applicationData.cnt_children),
    cnt_fam_members: toNumber(applicationData.cnt_fam_members),
    amt_income_total: toNumber(applicationData.amt_income_total),
    amt_credit: toNumber(applicationData.amt_credit),
    amt_annuity: toNumber(applicationData.amt_annuity),
    amt_goods_price: toNumber(applicationData.amt_goods_price),
    days_birth: toNumber(applicationData.days_birth),
    days_employed: toNumber(applicationData.days_employed),
    days_last_phone_change: toNumber(applicationData.days_last_phone_change),
    ext_source_1: toNumber(applicationData.ext_source_1),
    ext_source_2: toNumber(applicationData.ext_source_2),
    ext_source_3: toNumber(applicationData.ext_source_3),
  };

  assertRequiredPayloadFields(payload);

  return payload;
};

export const calculateEligibilityScore = (probDefault) => {
  const parsedProbDefault = Number(probDefault);

  if (
    !Number.isFinite(parsedProbDefault)
    || parsedProbDefault < 0
    || parsedProbDefault > 1
  ) {
    throw new InvalidMlProbabilityError(probDefault);
  }

  // ── Skor 3 zona (konsisten dengan kriteria foto) ──────────
  // ✅ LAYAK            (prob_default < 0.400)  → skor 75 — 100
  // ⚠️  DIPERTIMBANGKAN (0.400 ≤ prob < 0.666) → skor 25 — 74
  // ❌ TIDAK LAYAK      (prob_default ≥ 0.666)  → skor  0 — 24
  const probBerhasil = 1 - parsedProbDefault;

  if (parsedProbDefault < 0.400) {
    return Math.round(75 + ((probBerhasil - 0.6) / 0.4) * 25);
  } else if (parsedProbDefault < 0.666) {
    return Math.round(25 + ((probBerhasil - 0.335) / (0.6 - 0.335)) * 49);
  } else {
    return Math.round((probBerhasil / 0.334) * 24);
  }
};

export const mapPredictionToLoanAiAssessment = (prediction) => {
  const prob_default = Number(prediction.prob_default);
  let ai_recommendation;
  let risk_level;

  if (prob_default < 0.400) {
    ai_recommendation = 'LAYAK';
    risk_level = 'LOW';
  } else if (prob_default < 0.666) {
    ai_recommendation = 'PERLU_DIPERTIMBANGKAN';
    risk_level = 'MEDIUM';
  } else {
    ai_recommendation = 'TIDAK_LAYAK';
    risk_level = 'HIGH';
  }

  return {
    ai_recommendation,
    risk_level,
    prob_default,
    threshold: Number(prediction.threshold),
    confidence: Number(prediction.confidence),
    model_name: prediction.model_name,
    model_version: prediction.model_version,
    human_review_required: prediction.human_review_required,
    final_decision: prediction.final_decision,
    note: prediction.note,
    eligibility_score: calculateEligibilityScore(prob_default),
  };
};

export const buildLoanAiAssessmentRecord = ({
  loanId,
  requestPayload,
  prediction,
  scoredAt = new Date(),
}) => {
  return {
    loan_id: loanId,
    ...mapPredictionToLoanAiAssessment(prediction),
    request_payload_json: JSON.stringify(requestPayload),
    response_payload_json: JSON.stringify(prediction),
    scored_at: scoredAt,
  };
};
