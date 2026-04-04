import "./styles.css";
import { loadAllTasks } from "./allTasks.js";


let content = document.querySelector(".main-content")

let btn_allTasks = document.querySelector("#all_Tasks")
let btn_work = document.querySelector("#work")
let btn_personal = document.querySelector("#personal")
let btn_university = document.querySelector("#university")
let btn_home = document.querySelector("#home")


function clearContent() {
    content.innerHTML = "";
}

btn_allTasks.addEventListener("click", () => {
    clearContent()
    loadAllTasks()
})

btn_work.addEventListener("click", () => {
    clearContent()
})

btn_personal.addEventListener("click", () => {
    clearContent()

})

btn_university.addEventListener("click", () => {
    clearContent()
})

btn_home.addEventListener("click", () => {
    clearContent()

})