import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-df51c-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsInDB = ref(database, "items")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value

    if(inputValue != ""){
        push(itemsInDB, inputValue)
    }
    clearInputFieldEl()
})

inputFieldEl.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault()
        addButtonEl.click()
    }
})

onValue(itemsInDB, function(snapshot){

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val()) 

        clearShoppingListEl()
        for(let i=0; i < itemsArray.length; i++){
            let currentItem = itemsArray[i]
            
            appendToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = `No items here ... yet`
    }
})

function clearInputFieldEl () {
    inputFieldEl.value = ""
}

function clearShoppingListEl () {
    shoppingListEl.innerHTML = ""
}

function appendToShoppingListEl (item) {

    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    shoppingListEl.append(newEl)

    newEl.addEventListener("click", function() {
        let itemLocationInDB = ref(database, `items/${itemID}`)
        remove(itemLocationInDB)
    })

}
