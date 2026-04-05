import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type ChatMultimodalBodyParam = FromSchema<typeof schemas.ChatMultimodal.body>;
export type CheckRequestStatusMetadataParam = FromSchema<typeof schemas.CheckRequestStatus.metadata>;
export type CreateApiKeyBodyParam = FromSchema<typeof schemas.CreateApiKey.body>;
export type CreateUserBodyParam = FromSchema<typeof schemas.CreateUser.body>;
export type DeleteFileMetadataParam = FromSchema<typeof schemas.DeleteFile.metadata>;
export type DeleteUserMetadataParam = FromSchema<typeof schemas.DeleteUser.metadata>;
export type PollRequestMetadataParam = FromSchema<typeof schemas.PollRequest.metadata>;
export type RevokeApiKeyMetadataParam = FromSchema<typeof schemas.RevokeApiKey.metadata>;
export type UploadFileBodyParam = FromSchema<typeof schemas.UploadFile.body>;
