const express = require("express")
const cors = require("cors")
const { createClient } = require("@supabase/supabase-js")

const app = express()
app.use(cors())
app.use(express.json())

// 여기에 Supabase 값 넣기
const supabase = createClient(
    "https://vwynsgqetepnqglspyxh.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3eW5zZ3FldGVwbnFnbHNweXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDk2NzAsImV4cCI6MjA4MjU4NTY3MH0.LqE5HNCXZZmhW7uobC4r8pcqqehqCScn8ZoY3Wo9780"
)

// 댓글 저장
app.post("/comment", async (req, res) => {
    const { author, content } = req.body;

    const { error } = await supabase
        .from("comments")
        .insert([{ author, content }]);

    if (error) {
        console.error(error);
        return res.status(500).send("DB 오류");
    }

    res.sendStatus(200);
});


// 댓글 불러오기
app.get("/comment", async (req, res) => {
    const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("id", { ascending: false })

    if (error) return res.status(500).send("불러오기 실패")
    res.json(data)
})

app.listen(3000, () => {
    console.log("서버 실행중 👉 http://localhost:3000")
})
