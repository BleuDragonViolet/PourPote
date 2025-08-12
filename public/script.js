const playlist = [
        "music/Les_copains_dabord.mp3",
    "music/Dommage.mp3",
    "music/Chacun_sa_route.mp3",
    "music/Cosmo.mp3",
    "music/Ferme_les_yeux_et_imagine_toi_feat_Blacko.mp3",
    "music/On_verra.mp3",
    "music/Pour_un_pote_Bande_originale_du_film_Brice_3.mp3",
    "music/Un_homme_debout.mp3"
];


let current = 0;
const audio = document.getElementById("audioPlayer");
audio.src = playlist[current];

audio.addEventListener("ended", () => {
    current = (current + 1) % playlist.length;
    audio.src = playlist[current];
    audio.play();
});



// Messages wall
const messagesEl = document.getElementById('messages');
const form = document.getElementById('msgForm');
const msgText = document.getElementById('msgText');

async function fetchMessages() {
    try {
        const res = await fetch('/api/messages');
        const data = await res.json();
        renderMessages(data);
    } catch (err) {
        console.error(err);
    }
}

function renderMessages(msgs) {
    messagesEl.innerHTML = '';
    if (!msgs.length) {
        messagesEl.innerHTML = '<div class="message">Aucun message pour l\'instant — sois le premier !</div>';
        return;
    }
    msgs.forEach(m => {
        const div = document.createElement('div');
        div.className = 'message';
        const txt = document.createElement('div');
        txt.textContent = m.text;
        const time = document.createElement('time');
        const d = new Date(m.createdAt);
        time.textContent = d.toLocaleString();
        div.appendChild(txt);
        div.appendChild(time);
        messagesEl.appendChild(div);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = msgText.value.trim();
    if (!text) return;
    try {
        const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error('Erreur');
        msgText.value = '';
        fetchMessages();
    } catch (err) {
        alert('Erreur en envoyant le message');
        console.error(err);
    }
});

// initial load
fetchMessages();
