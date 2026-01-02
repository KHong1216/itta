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

export async function signOut(){
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function getCurrentUser(){
    const supabase = await createClient();
    const{ data:{user}, error } = await supabase.auth.getUser();
    return user;
}