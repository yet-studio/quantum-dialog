/**
 * Charge et affiche les dialogues dans la langue spécifiée
 * @param {string} lang - Code de langue ('fr' ou 'en')
 */
async function loadDialogs(lang) {
    try {
        const response = await fetch('/src/content/dialogs.json');
        const data = await response.json();
        
        const dialogsContainer = document.querySelector('.messages');
        const dialogs = data[lang].conversations;
        
        dialogsContainer.innerHTML = dialogs.map(conversation => 
            conversation.messages.map(message => `
                <div class="message ${message.sender.toLowerCase()}">
                    <div class="sender">
                        <span class="sender-emoji">${message.emoji}</span>
                        <span class="sender-name">${message.sender}</span>
                    </div>
                    <div class="message-content">${message.content}</div>
                </div>
            `).join('')
        ).join('');
        
        // Ajouter les classes d'animation après le chargement
        document.querySelectorAll('.message').forEach((message, index) => {
            setTimeout(() => {
                message.classList.add('visible');
            }, index * 100);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des dialogues:', error);
    }
}
