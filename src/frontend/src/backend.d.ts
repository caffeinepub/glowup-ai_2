import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export type Gender = {
    __kind__: "other";
    other: string;
} | {
    __kind__: "female";
    female: null;
} | {
    __kind__: "male";
    male: null;
} | {
    __kind__: "nonBinary";
    nonBinary: null;
};
export interface Message {
    question: string;
    answer: string;
    timestamp: Time;
}
export interface PhotoAnalysis {
    hairScore: bigint;
    overallScore: bigint;
    symmetryScore: bigint;
    timestamp: Time;
    skinScore: bigint;
    styleScore: bigint;
    photoId: string;
}
export interface UserProfile {
    age: bigint;
    bio: string;
    username: string;
    createdAt: Time;
    goals: Array<string>;
    gender: Gender;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessage(question: string, answer: string): Promise<void>;
    addPhotoAnalysis(photoId: string, skinScore: bigint, hairScore: bigint, symmetryScore: bigint, styleScore: bigint, overallScore: bigint): Promise<void>;
    addPhotoReference(id: string, blob: ExternalBlob): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProfile(username: string, age: bigint, gender: Gender, goals: Array<string>, bio: string): Promise<void>;
    getAllProfiles(): Promise<Array<UserProfile>>;
    getCallerProfile(): Promise<UserProfile>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPhotoReference(id: string): Promise<ExternalBlob>;
    getProfile(user: Principal): Promise<UserProfile>;
    getUserAnalyses(user: Principal): Promise<Array<PhotoAnalysis>>;
    getUserMessages(user: Principal): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(username: string, age: bigint, gender: Gender, goals: Array<string>, bio: string): Promise<void>;
}
