import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://YOUR_PROJECT_ID.supabase.co",
    "YOUR_PUBLIC_ANON_KEY"
);

function showError(msg) {
    const el = document.getElementById("error-msg");
    el.innerText = msg;
    el.style.display = "block";
}

function isValidEmail(email) {
    return email.includes("@") && email.includes(".");
}

window.login = async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    document.getElementById("error-msg").style.display = "none";

    if (!email || !password) {
        showError("이메일과 비밀번호를 모두 입력해 주세요.");
        return;
    }

    if (!isValidEmail(email)) {
        showError("이메일 형식이 올바르지 않습니다.");
        return;
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        showError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
    }

    // 로그인 성공
    location.href = "index.html";
};
