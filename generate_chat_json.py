import json

def extract_messages(filename):
    messages = []
    current_message = None
    message_content = []
    
    with open(filename, 'r', encoding='utf-8') as f:
        # Skip header (first 10 lines)
        for _ in range(10):
            next(f)
            
        for line in f:
            # Check for message sender
            if '**USER** (en off)' in line:
                if current_message:
                    current_message['content'] = '\n'.join(message_content).strip()
                    messages.append(current_message)
                current_message = {'sender': 'USER', 'type': 'off'}
                message_content = [line.replace('**USER** (en off) :', '').strip()]
            elif line.startswith('**USER**:'):
                if current_message:
                    current_message['content'] = '\n'.join(message_content).strip()
                    messages.append(current_message)
                current_message = {'sender': 'USER', 'type': 'normal'}
                message_content = [line.replace('**USER**:', '').strip()]
            elif line.startswith('**AI**:'):
                if current_message:
                    current_message['content'] = '\n'.join(message_content).strip()
                    messages.append(current_message)
                current_message = {'sender': 'AI', 'type': 'normal'}
                message_content = [line.replace('**AI**:', '').strip()]
            elif current_message and line.strip():
                message_content.append(line.strip())
    
    # Add the last message
    if current_message:
        current_message['content'] = '\n'.join(message_content).strip()
        messages.append(current_message)
    
    return {'messages': messages}

def main():
    # Extract messages and write to chat.json
    chat = extract_messages('Dialog.md')
    with open('chat.json', 'w', encoding='utf-8') as f:
        json.dump(chat, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    main()
