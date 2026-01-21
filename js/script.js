


// 공지사항 페이지로 이동
function notice() {
    window.location.href = "notice.html";
}

function modupload() {
    window.location.href = "modupload.html";
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {

    // 스크롤 애니메이션
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });

    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const theme = localStorage.getItem("theme");
    const icon = document.getElementById("themeIcon");

    if (theme === "light") {
        document.body.classList.add("light");
        icon.classList.replace("fa-moon", "fa-sun");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
    }

    // ⭐ 페이지 로드 시 댓글 불러오기
    loadComments();
});


function toggleDarkMode() {
    const isLight = document.body.classList.toggle("light");
    const icon = document.getElementById("themeIcon");

    icon.classList.toggle("fa-moon", !isLight);
    icon.classList.toggle("fa-sun", isLight);

    localStorage.setItem("theme", isLight ? "light" : "dark");
}

// ======================
// ===== 댓글 기능 =====
// ======================

// 댓글 전송
function sendComment() {
    const authorInput = document.getElementById("author");
    const contentInput = document.getElementById("content");

    if (!authorInput || !contentInput) return;

    const author = authorInput.value.trim();
    const content = contentInput.value.trim();

    if (author === "" || content === "") {
        alert("닉네임이랑 댓글 다 써주세요!");
        return;
    }

    fetch("http://localhost:3000/comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            author: author,
            content: content
        })
    }).then(() => {
        authorInput.value = "";
        contentInput.value = "";
        loadComments();
    });
}



// 댓글 불러오기
// 댓글 불러오기
function loadComments() {
    const list = document.getElementById("commentList");
    if (!list) return;

    fetch("http://localhost:3000/comment")
        .then(res => res.json())
        .then(data => {
            list.innerHTML = "";

            data.forEach(comment => {
                const li = document.createElement("li");

                li.innerHTML = `
                  <div class="comment">
                    <div class="comment-header">
                      <span class="comment-author">
                        ${comment.author ?? "익명"}
                      </span>
                      <span class="comment-time">
                        ${new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div class="comment-content">
                      ${comment.content}
                    </div>
                  </div>
                `;

                list.appendChild(li);
            });
        });
}

async function uploadMod() {
    const file = document.getElementById("modFile").files[0];
    if (!file) return alert("파일 선택해");

    const filePath = `${Date.now()}_${file.name}`;

    // 1. Storage 업로드
    const { error: uploadError } = await supabase
        .storage
        .from("mods")
        .upload(filePath, file);

    if (uploadError) {
        alert("파일 업로드 실패");
        return;
    }

    // 2. DB에 정보 저장
    const { error } = await supabase
        .from("mods")
        .insert([{
            title: modTitle.value,
            description: modDesc.value,
            loader: loader.value,
            mc_version: mcVersion.value,
            author: document.getElementById("author")?.value || "익명",
            file_path: filePath
        }]);

    if (error) {
        alert("DB 저장 실패");
    }
    else if (!file.name.endsWith(".jar")){
        alert("jar만 가능");
        return;
    }
    else {
        alert("모드 등록 완료!");
    }
}


async function loadMods() {
    const { data } = await supabase
        .from("mods")
        .select("*")
        .order("created_at", { ascending: false });

    const list = document.getElementById("modList");
    list.innerHTML = "";

    data.forEach(mod => {
        const url = supabase
            .storage
            .from("mods")
            .getPublicUrl(mod.file_path).data.publicUrl;

        list.innerHTML += `
      <div class="mod-card">
        <h3>${mod.title}</h3>
        <p>${mod.description}</p>
        <p>${mod.loader} / ${mod.mc_version}</p>
        <p>by ${mod.author}</p>
        <a href="${url}" download>다운로드</a>
      </div>
    `;
    });
}


window.onload = () => {
    if (!localStorage.getItem("popupSeen")) {
        document.getElementById("popup").classList.remove("hidden");
    }
};

function closePopup() {
    document.getElementById("popup").classList.add("hidden");
    localStorage.setItem("popupSeen", "true");
}

function openLogin() {
    window.location.href = "login.html";
}

function openSignup() {
    window.location.href = "signup.html";
}
