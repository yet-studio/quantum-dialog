import i18n from '../js/i18n.js';

class DialogueViewer {
    constructor() {
        this.chatContainer = document.querySelector('.chat-container');
        this.loadChat();
    }

    async loadChat() {
        try {
            const response = await fetch('/chat.json');
            const chat = await response.json();
            this.renderChat(chat);
        } catch (error) {
            console.error('Erreur lors du chargement du chat:', error);
            this.chatContainer.innerHTML = '<p class="error">Une erreur est survenue lors du chargement du dialogue.</p>';
        }
    }

    renderChat(chat) {
        const messages = chat.messages.map(message => {
            const isHuman = message.role === 'human';
            return `
                <div class="message ${isHuman ? 'human' : 'ai'}">
                    <div class="message-content">${message.content}</div>
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
