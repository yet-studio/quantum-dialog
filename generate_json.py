import json
import re

def read_markdown_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return f.readlines()

def extract_header(lines):
    header = {
        'title': '',
        'subtitle': '',
        'context': '',
        'note': ''
    }
    
    for i, line in enumerate(lines):
        if line.startswith('# '):
            header['title'] = line[2:].strip()
        elif line.startswith('## '):
            header['subtitle'] = line[3:].strip()
        elif line.startswith('### '):
            header['context'] = line[4:].strip()
        elif line.startswith('#### '):
            header['note'] = line[5:].strip()
            break
    
    return header

def extract_messages(lines):
    messages = []
    current_message = None
    message_content = []
    
    for line in lines[10:]:  # Skip header
        # Check for message sender
        if line.startswith('**USER**:'):
            if current_message:
                current_message['content'] = '\n'.join(message_content).strip()
                messages.append(current_message)
            current_message = {'sender': 'USER'}
            message_content = [line.replace('**USER**:', '').strip()]
        elif line.startswith('**AI**:'):
            if current_message:
                current_message['content'] = '\n'.join(message_content).strip()
                messages.append(current_message)
            current_message = {'sender': 'AI'}
            message_content = [line.replace('**AI**:', '').strip()]
        elif current_message and line.strip():
            message_content.append(line.strip())
    
    # Add the last message
    if current_message:
        current_message['content'] = '\n'.join(message_content).strip()
        messages.append(current_message)
    
    return {'messages': messages}

def main():
    # Read the markdown file
    lines = read_markdown_file('Dialog.md')
    
    # Extract header and messages
    header = extract_header(lines)
    chat = extract_messages(lines)
    
    # Write header to titles.json
    with open('titles.json', 'w', encoding='utf-8') as f:
        json.dump(header, f, ensure_ascii=False, indent=4)
    
    # Write messages to chat.json
    with open('chat.json', 'w', encoding='utf-8') as f:
        json.dump(chat, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    main()
