const ChatMultimodal = {"body":{"type":"object","required":["prompt"],"properties":{"project_id":{"type":"string"},"prompt":{"type":"string"},"images":{"type":"array","items":{"type":"string"}},"audios":{"type":"array","items":{"type":"string"}},"videos":{"type":"array","items":{"type":"string"}},"documents":{"type":"array","items":{"type":"string"}}},"$schema":"http://json-schema.org/draft-04/schema#"}} as const
;
const CheckRequestStatus = {"metadata":{"allOf":[{"type":"object","properties":{"requestId":{"type":"string","$schema":"http://json-schema.org/draft-04/schema#"}},"required":["requestId"]}]}} as const
;
const CreateApiKey = {"body":{"type":"object","required":["email"],"properties":{"email":{"type":"string"}},"$schema":"http://json-schema.org/draft-04/schema#"}} as const
;
const CreateUser = {"body":{"type":"object","required":["email"],"properties":{"email":{"type":"string","format":"email"},"plan":{"type":"string","enum":["free","payg","fixed"],"default":"free"}},"$schema":"http://json-schema.org/draft-04/schema#"}} as const
;
const DeleteFile = {"metadata":{"allOf":[{"type":"object","properties":{"fileName":{"type":"string","$schema":"http://json-schema.org/draft-04/schema#"}},"required":["fileName"]}]}} as const
;
const DeleteUser = {"metadata":{"allOf":[{"type":"object","properties":{"userId":{"type":"string","$schema":"http://json-schema.org/draft-04/schema#"}},"required":["userId"]}]}} as const
;
const PollRequest = {"metadata":{"allOf":[{"type":"object","properties":{"requestId":{"type":"string","$schema":"http://json-schema.org/draft-04/schema#"}},"required":["requestId"]}]}} as const
;
const RevokeApiKey = {"metadata":{"allOf":[{"type":"object","properties":{"keyId":{"type":"string","$schema":"http://json-schema.org/draft-04/schema#"}},"required":["keyId"]}]}} as const
;
const UploadFile = {"body":{"type":"object","properties":{"file":{"type":"string","format":"binary"}},"required":["file"],"$schema":"http://json-schema.org/draft-04/schema#"}} as const
;
export { ChatMultimodal, CheckRequestStatus, CreateApiKey, CreateUser, DeleteFile, DeleteUser, PollRequest, RevokeApiKey, UploadFile }
