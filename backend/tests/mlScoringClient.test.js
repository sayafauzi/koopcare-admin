import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  MlApiError,
  assertModelReady,
  predictCreditRisk,
} from '../src/services/mlScoringClient.js';

const jsonResponse = (body, { status = 200 } = {}) => new Response(
  JSON.stringify(body),
  {
    status,
    headers: { 'Content-Type': 'application/json' },
  },
);

test('assertModelReady accepts artifact-backed available model metadata', async () => {
  const modelInfo = {
    model_loaded: true,
    artifact_status: 'available',
    artifact_error: null,
    metadata_source: 'artifact',
  };

  const result = await assertModelReady({
    baseUrl: 'http://ml-api.test',
    fetchImpl: async (url, options) => {
      assert.equal(url, 'http://ml-api.test/model-info');
      assert.equal(options.method, 'GET');
      return jsonResponse(modelInfo);
    },
  });

  assert.deepEqual(result, modelInfo);
});

test('assertModelReady rejects metadata that is not loaded from the model artifact', async () => {
  await assert.rejects(
    () => assertModelReady({
      fetchImpl: async () => jsonResponse({
        model_loaded: true,
        artifact_status: 'available',
        artifact_error: null,
        metadata_source: 'settings',
      }),
    }),
    (error) => {
      assert.ok(error instanceof MlApiError);
      assert.equal(error.code, 'ml_model_not_ready');
      assert.equal(error.detail.metadata_source, 'settings');
      return true;
    },
  );
});

test('predictCreditRisk preserves ML API error detail', async () => {
  await assert.rejects(
    () => predictCreditRisk({}, {
      fetchImpl: async () => jsonResponse({
        detail: {
          error: 'model_artifact_missing',
          message: 'Model artifact is missing.',
        },
      }, { status: 503 }),
    }),
    (error) => {
      assert.ok(error instanceof MlApiError);
      assert.equal(error.status, 503);
      assert.equal(error.code, 'model_artifact_missing');
      assert.equal(error.message, 'Model artifact is missing.');
      return true;
    },
  );
});
