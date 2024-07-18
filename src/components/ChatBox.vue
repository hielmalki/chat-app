<template>
  <div class="container mt-4">
    <div class="card chat-card">
      <div class="card-header text-center bg-primary text-white">
        <h5 class="card-title">Customer Chat</h5>
      </div>
      <div class="card-body chat-box p-3">
        <div class="messages">
          <div
              v-for="message in messages"
              :key="message.id"
              :class="[
              'message p-2 mb-1 rounded',
              message.sender === 'Customer' ? 'sent-message' : 'received-message'
            ]"
          >
            <strong>{{ message.sender }}:</strong> {{ message.content }}
            <div class="message-timestamp">{{ formatTimestamp(message.timestamp) }}</div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="row">
          <div class="col-10">
            <input
                v-model="newMessage"
                @keyup.enter="sendMessage"
                type="text"
                class="form-control no-outline rounded-input"
                placeholder="Type a message..."
            />
          </div>
          <div class="col-2">
            <v-icon @click="sendMessage" class="btn btn-primary no-outline rounded-btn w-100">
              Send
            </v-icon>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chatService from '../services/chatService';

export default {
  data() {
    return {
      sessionId: null,
      customerId: 1, // Beispiel-ID des Kunden
      messages: [],
      newMessage: '',
    };
  },
  async created() {
    try {
      const session = await chatService.startChat({ customerId: this.customerId });
      console.log('Chat session started:', session);
      this.sessionId = session.id;
      await this.loadMessages();
    } catch (error) {
      console.error('Error starting chat session:', error);
    }
  },
  methods: {
    async loadMessages() {
      try {
        console.log(`Loading messages for sessionId: ${this.sessionId}`);
        this.messages = await chatService.getMessages(this.sessionId);
        console.log('Loaded messages:', this.messages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() !== '' && this.sessionId) {
        const message = {
          sessionId: this.sessionId,
          sender: 'Customer', // Beispiel-Absender
          content: this.newMessage,
        };
        try {
          console.log('Sending message:', message);
          await chatService.sendMessage(message);
          this.newMessage = '';
          await this.loadMessages();

          // Holen Sie die Antwort des Chatbots
          const botResponse = await chatService.getChatbotResponse(message.content);
          console.log('Bot Response:', botResponse);
          const botMessage = {
            sessionId: this.sessionId,
            sender: 'Bot', // Absender als Bot kennzeichnen
            content: botResponse,
          };
          await chatService.sendMessage(botMessage);
          await this.loadMessages();
        } catch (error) {
          console.error('Error sending message:', error);
        }
      } else {
        console.error('Message content or sessionId is invalid.');
      }
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  },
};
</script>

<style>
.chat-card {
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.chat-box {
  height: 300px;
  overflow-y: auto;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}
.messages {
  display: flex;
  flex-direction: column;
}
.message {
  transition: all 0.3s ease;
}
.sent-message {
  align-self: flex-end;
  background-color: #d1e7ff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 5px;
  max-width: 60%;
  text-align: right;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.received-message {
  align-self: flex-start;
  background-color: #f1f0f0;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 5px;
  max-width: 60%;
  text-align: left;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.received-message strong {
  color: #000;
}
.message-timestamp {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
}
.input-group .form-control.no-outline {
  box-shadow: none;
  border-right: 0;
  border-radius: 15px 0 0 15px;
}
.input-group .form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}
.input-group .btn-primary.no-outline {
  box-shadow: none;
  border-left: 0;
  border-radius: 0 15px 15px 0;
}
.input-group .btn-primary:focus {
  box-shadow: none;
}
.input-group .form-control,
.input-group .btn-primary {
  border-radius: 0;
}
.input-group .btn-primary.no-outline {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.input-group .form-control.no-outline {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.bg-primary {
  background-color: #007bff !important;
}
.text-white {
  color: #fff !important;
}
</style>
