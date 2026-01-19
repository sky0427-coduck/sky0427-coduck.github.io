import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://YOUR_PROJECT_ID.supabase.co",
    "YOUR_PUBLIC_ANON_KEY"
);

function showError(msg) {
    const el = document.getElementById("error-msg");
    el.innerText = msg;
    el.style.display = "block";
    document.getElementById("success-msg").style.display = "none";
}

function showSuccess(msg) {
    const el = document.getElementById("success-msg");
    el.innerText = msg;
    el.style.display = "block";
    document.getElementById("error-msg").style.display = "none";
}

function isValidEmail(email) {
    return email.includes("@") && email.includes(".");
}

window.signup = async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const passwordCheck = document.getElementById("password-check").value.trim();

    document.getElementById("error-msg").style.display = "none";
    document.getElementById("success-msg").style.display = "none";

    if (!email || !password || !passwordCheck) {
        showError("모든 항목을 입력해 주세요.");
        return;
    }

    if (!isValidEmail(email)) {
        showError("이메일 형식이 올바르지 않습니다.");
        return;
    }

    if (password.length < 6) {
        showError("비밀번호는 최소 6자 이상이어야 합니다.");
        return;
    }

    if (password !== passwordCheck) {
        showError("비밀번호가 서로 일치하지 않습니다.");
        return;
    }

    const { error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        showError(error.message);
        return;
    }

    showSuccess("회원가입 완료! 이메일을 확인해 주세요.");
};
