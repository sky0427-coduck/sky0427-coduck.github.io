import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://YOUR_PROJECT_ID.supabase.co",
    "YOUR_PUBLIC_ANON_KEY"
);

const box = document.getElementById("profile-box");

async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        location.href = "login.html";
        return;
    }

    const name =
        user.user_metadata?.user_name ||
        user.user_metadata?.full_name ||
        user.email ||
        "사용자";

    box.innerHTML = `
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>아이디:</strong> ${user.id}</p>
        <p><strong>로그인 방식:</strong> ${user.app_metadata?.provider}</p>
    `;
}

window.logout = async function () {
    await supabase.auth.signOut();
    location.href = "index.html";
};

loadProfile();
