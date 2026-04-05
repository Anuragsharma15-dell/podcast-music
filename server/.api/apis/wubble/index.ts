import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'wubble/1.0.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Health check endpoint
   *
   */
  healthCheck(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/health', 'get');
  }

  /**
   * API documentation
   *
   */
  apiDocs(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/docs', 'get');
  }

  /**
   * Swagger UI Bundle JS
   *
   */
  swaggerUIBundle(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/swagger-ui-bundle.js', 'get');
  }

  /**
   * Swagger UI Standalone Preset JS
   *
   */
  swaggerUIPreset(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/swagger-ui-standalone-preset.js', 'get');
  }

  /**
   * Swagger UI Init JS
   *
   */
  swaggerUIInit(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/swagger-ui-init.js', 'get');
  }

  /**
   * Swagger UI CSS
   *
   */
  swaggerUICSS(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/swagger-ui.css', 'get');
  }

  /**
   * Create a new user
   *
   */
  createUser(body: types.CreateUserBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/user', 'post', body);
  }

  /**
   * Delete a user
   *
   */
  deleteUser(metadata: types.DeleteUserMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/user/{userId}', 'post', metadata);
  }

  /**
   * Create a new API key
   *
   */
  createApiKey(body: types.CreateApiKeyBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/apikeys', 'post', body);
  }

  /**
   * List API keys
   *
   */
  listApiKeys(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/apikeys', 'get');
  }

  /**
   * Revoke an API key
   *
   */
  revokeApiKey(metadata: types.RevokeApiKeyMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/apikeys/{keyId}', 'delete', metadata);
  }

  /**
   * Chat endpoint for multimodal requests
   *
   */
  chatMultimodal(body: types.ChatMultimodalBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/chat', 'post', body);
  }

  /**
   * Poll for request completion status
   *
   */
  pollRequest(metadata: types.PollRequestMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/polling/{requestId}', 'get', metadata);
  }

  /**
   * Check request status
   *
   */
  checkRequestStatus(metadata: types.CheckRequestStatusMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/request/{requestId}/status', 'get', metadata);
  }

  /**
   * Upload a single media file
   *
   */
  uploadFile(body: types.UploadFileBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/upload', 'post', body);
  }

  /**
   * Delete a file from storage
   *
   */
  deleteFile(metadata: types.DeleteFileMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/upload/delete/{fileName}', 'delete', metadata);
  }

  get_apiv1credits(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/api/v1/credits', 'get');
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { ChatMultimodalBodyParam, CheckRequestStatusMetadataParam, CreateApiKeyBodyParam, CreateUserBodyParam, DeleteFileMetadataParam, DeleteUserMetadataParam, PollRequestMetadataParam, RevokeApiKeyMetadataParam, UploadFileBodyParam } from './types';
