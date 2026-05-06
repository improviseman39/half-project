// ====================================================
// ONLY CHANGE THESE 6 LINES — YOUR FIREBASE KEYS
// How to get them:
//   1. Go to console.firebase.google.com
//   2. Click HALF-PROJECT
//   3. Click gear icon ⚙️ → Project Settings
//   4. Scroll down → click </> web icon → Register app
//   5. Copy each value below
// ====================================================

import { initializeApp }                                        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"
import { getFirestore, collection, addDoc,
         onSnapshot, orderBy, query, serverTimestamp }          from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"

const firebaseConfig = {
  apiKey:            "AIzaSyAlh_5E_nE_Pi4xDuqvQhB9qL04aNg5wuA",
  authDomain:        "half-project-b84ce.firebaseapp.com",
  projectId:         "half-project-b84ce",
  storageBucket:     "half-project-b84ce.firebasestorage.app",
  messagingSenderId: "1032528450623",
  appId:             "G-Y6YQQ8X6P9"
}

// ====================================================
// DO NOT CHANGE ANYTHING BELOW THIS LINE
// ====================================================

const statusBar = document.getElementById('statusBar')
const saveBtn   = document.getElementById('saveBtn')
const notesList = document.getElementById('notesList')

let db

// Try to connect to Firebase
try {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)

  // Show green connected message
  statusBar.textContent = '✅ Connected to Firebase!'
  statusBar.classList.add('connected')
  saveBtn.disabled = false

  // Start loading notes
  loadNotes()

} catch (error) {
  // Show red error if keys are wrong
  statusBar.textContent = '❌ Connection failed — check your Firebase keys in app.js'
  statusBar.classList.add('error')
  notesList.innerHTML = '<div class="empty">Could not connect to Firebase.</div>'
  console.error(error)
}

// ====================================================
// SAVE BUTTON — saves note to Firebase
// ====================================================
saveBtn.addEventListener('click', async () => {
  const title = document.getElementById('noteTitle').value.trim()
  const body  = document.getElementById('noteBody').value.trim()

  if (!title || !body) {
    alert('Please fill in both the title and the note!')
    return
  }

  saveBtn.disabled = true
  saveBtn.textContent = 'Saving...'

  try {
    await addDoc(collection(db, 'notes'), {
      title:     title,
      body:      body,
      createdAt: serverTimestamp()
    })

    // Clear the form after saving
    document.getElementById('noteTitle').value = ''
    document.getElementById('noteBody').value  = ''

  } catch (error) {
    alert('Error saving: ' + error.message)
    console.error(error)
  }

  saveBtn.disabled = false
  saveBtn.textContent = 'Save to Firebase'
})

// ====================================================
// LOAD NOTES — reads from Firebase in real time
// ====================================================
function loadNotes() {
  const q = query(
    collection(db, 'notes'),
    orderBy('createdAt', 'desc')
  )

  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      notesList.innerHTML = '<div class="empty">No notes yet — add your first one above!</div>'
      return
    }

    notesList.innerHTML = ''

    snapshot.forEach((doc) => {
      const data = doc.data()
      const date = data.createdAt
        ? new Date(data.createdAt.seconds * 1000).toLocaleString()
        : 'Just now'

      const div = document.createElement('div')
      div.className = 'note-item'
      div.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <small>🕒 ${date}</small>
      `
      notesList.appendChild(div)
    })
  })
}