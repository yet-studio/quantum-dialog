import i18n from '../js/i18n.js';

class DialogueViewer {
    constructor() {
        this.chatContainer = document.querySelector('.chat-container');
        this.loadChat();
    }

    async loadChat() {
        try {
            const response = await fetch('../content/dialogs.json');
            const chat = await response.json();
            this.renderChat(chat);
        } catch (error) {
            console.error('Erreur lors du chargement du chat:', error);
            this.chatContainer.innerHTML = '<p class="error">Une erreur est survenue lors du chargement du dialogue.</p>';
        }
    }

    renderChat(dialogData) {
        // Obtenir la langue actuelle
        const currentLang = document.documentElement.lang || 'fr';
        
        // Obtenir les conversations pour la langue actuelle
        const conversations = dialogData[currentLang].conversations;
        
        // Pour l'instant, on affiche la première conversation (intro)
        const introConversation = conversations.find(conv => conv.id === 'intro');
        
        if (!introConversation) {
            throw new Error('Conversation intro non trouvée');
        }
        
        const messages = introConversation.messages.map(message => {
            const isHuman = message.sender === 'Human';
            return `
                <div class="message ${isHuman ? 'human' : 'ai'}">
                    <div class="message-content">
                        <span class="emoji">${message.emoji}</span>
                        ${message.content}
                    </div>
                </div>
            `;
        }).join('');

        this.chatContainer.innerHTML = messages;
    }
}

// Initialiser le viewer quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new DialogueViewer();
});
