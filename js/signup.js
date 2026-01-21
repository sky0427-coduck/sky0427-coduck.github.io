import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
console.log("signup.js loaded");

const supabase = createClient(
    "https://veozdbhwrxcidodygxfc.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlb3pkYmh3cnhjaWRvZHlneGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTkxODUsImV4cCI6MjA4NDQ3NTE4NX0.a5lVqr8zXRpbTBBVvUoEWw0_69yBR96QVNE_uub7qAk"
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

    const agree = document.getElementById("agree").checked;

    if (!agree) {
        showError("개인정보 수집 및 이용에 동의해야 합니다.");
        return;
    }


    if (!isValidEmail(email)) {
        showError("이메일 형식이 올바르지 않습니다.");
        return;
    }

    if (password.length < 8) {
        showError("비밀번호는 최소 8자 이상이어야 합니다.(영문, 특수문자만 가능)");
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

window.loginWithGithub = async function () {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "github"
    });

    if (error) {
        alert(error.message);
    }
};
