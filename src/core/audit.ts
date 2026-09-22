import type { Env } from "../types/env";

export function auditStatement(env:Env,userId:string,action:string,entityType:string,entityId:string,metadata:unknown){
 return env.DB.prepare('INSERT INTO audit_log (id,user_id,action,entity_type,entity_id,metadata_json) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),userId,action,entityType,entityId,JSON.stringify(metadata));
}
