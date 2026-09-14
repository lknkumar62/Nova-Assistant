export type NovaState='idle'|'listening'|'processing'|'speaking'|'error';
export type Tab='home'|'chat'|'voice'|'tools'|'settings';
export interface Message{id:string;role:'user'|'assistant';text:string;createdAt:number;}
export interface NovaSettings{wakeWordEnabled:boolean;wakePhrase:string;offlineFirst:boolean;autoSpeak:boolean;voice:string;sensitivity:'LOW'|'MEDIUM'|'HIGH';}
