"use server";

import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export async function signInWithEmail(email: string, password: string){
    const supabase = await createClient();

    const {data ,error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error){
        return{ error: error.message}
    }
    return{ success:true, user:data.user};
}

export async function signUpWithEmail(
    email: string,
    password: string,
    nickname: string
) {
    const supabase = await createClient();

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) return { error: "닉네임을 입력해 주세요." };

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nickname: trimmedNickname,
            },
        },
    });

    if (error) {
        const message = error.message.includes("already registered")
            ? "이미 가입된 이메일이에요."
            : error.message;
        return { error: message };
    }

    // 이메일 인증(confirmation)이 켜져 있으면 session이 null인 경우가 많음
    return {
        success: true,
        needsEmailConfirm: !data.session,
        user: data.user,
    };
}

export async function signOut(){
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function getCurrentUser(){
    const supabase = await createClient();
    const{ data:{user} } = await supabase.auth.getUser();
    return user;
}

export interface CurrentUserInfo {
    id: string;
    email: string | null;
}

export async function getCurrentUserInfo(): Promise<CurrentUserInfo | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    return { id: data.user.id, email: data.user.email ?? null };
}