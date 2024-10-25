import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Chat } from 'src/models/Chat';
import { Message } from 'src/models/Message';
import { Subscription, User } from 'src/models/User';
import { useQuasar } from 'quasar';

const API_BASE = '';
// const API_BASE = 'https://aip-1-862975568974.us-central1.run.app';

export const useChatStore = defineStore('chatStore', () => {
  const chats = ref<Chat[]>([]);
  const messages = ref<Message[]>([]);
  const currentChatId = ref<string | null>(null);
  const isLoading = ref<boolean>(false);

  const currentUser = ref<User | null>(null);
  const currentSubscription = ref<Subscription | null>(null);

  const $q = useQuasar();

  const currentChat = computed((): Chat | undefined => {
    console.log(currentChatId.value);
    if (!currentChatId.value) return undefined;
    return chats.value.find((c) => c.id == currentChatId.value);
  });

  const createErrorNotification = (message: string) => {
    $q.notify({
      type: 'warning', // Тип уведомления (ошибка)
      message: message, // Текст сообщения
      position: 'top', // Позиция уведомления (вверху экрана)
      icon: 'eva-alert-circle-outline',
      actions: [
        { icon: 'close', color: 'black', handler: () => {} }, // Кнопка закрытия уведомления
      ],
    });
  };

  async function login(provider: string) {
    location.href = `${API_BASE}/auth/login/${provider}`;
  }

  async function logout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    location.href = '/login';
  }

  async function fetchActualSubscription() {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/mine`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        currentSubscription.value = await response.json();
      } else {
        currentSubscription.value = null;
      }
    } catch (e) {
      currentSubscription.value = null;
    }
  }

  async function fetchUser() {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        currentUser.value = await response.json();
      } else {
        currentUser.value = null;
      }
    } catch (e) {
      currentUser.value = null;
    }
  }

  async function listChats() {
    const response = await fetch(`${API_BASE}/chats`, {
      method: 'GET',
      credentials: 'include',
    });
    chats.value = await response.json();
  }

  async function purchase() {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/purchase`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'daily_boost' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail ||
          'Не удалось выполнить покупку. Пожалуйста, попробуйте снова.';
        createErrorNotification(errorMessage);
      }
    } catch (e) {
      createErrorNotification('Произошла ошибка во время покупки.');
    }
  }

  async function deleteChat(chatId: string) {
    if (chatId == currentChatId.value) {
      currentChatId.value = null;
      messages.value = [];
    }

    await fetch(`${API_BASE}/chats/${chatId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await listChats();
  }

  async function renameChat(chatId: string, newName: string) {
    await fetch(`${API_BASE}/chats/${chatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: newName }),
      credentials: 'include',
    });
    await listChats();
  }

  async function fetchChatMessages(chatId: string) {
    try {
      currentChatId.value = chatId;
      const response = await fetch(
        `${API_BASE}/chats/${currentChatId.value}/messages`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );

      if (response.ok) {
        messages.value = (await response.json()).reverse();
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail ||
          'Не удалось получить сообщения. Пожалуйста, попробуйте снова.';
        createErrorNotification(errorMessage);
      }
    } catch (e) {
      createErrorNotification('Произошла ошибка при получении сообщений.');
    }
  }

  // Функция для инициализации чата с стримингом сообщений
  async function sendMessage(text: string) {
    messages.value.push({
      id: undefined,
      text,
      role: 'user',
      progress: false,
      tool_id: undefined,
      tool_name: undefined,
    });

    isLoading.value = true;

    const response = await fetch(
      currentChatId.value
        ? `${API_BASE}/chats/${currentChatId.value}/messages`
        : `${API_BASE}/chats`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        credentials: 'include',
      },
    );

    if (!response.ok) {
      createErrorNotification((await response.json()).detail);
      isLoading.value = false;
      return;
    }

    if (!response.body) {
      isLoading.value = false;
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let bufferedString = '';

    const readStream = () => {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            console.log('Stream finished');
            isLoading.value = false;
            return;
          }

          // Декодируем байты в строку
          bufferedString += decoder.decode(value, { stream: true });

          // Разбиваем по строкам
          const lines = bufferedString.split('\n');

          // Последнюю неполную строку оставляем на следующий цикл чтения
          bufferedString = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              try {
                const jsonData = JSON.parse(line);
                processStreamData(jsonData);
              } catch (e) {
                console.error('Error parsing JSON:', e);
                isLoading.value = false;
              }
            }
          }

          // Продолжаем читать поток
          readStream();
        })
        .catch((error) => {
          console.error('Stream read error:', error);
        });
    };

    // Начинаем чтение
    readStream();
  }

  interface StreamMessage {
    t: string;
    chat_id: string;
    text: string;
    tool_id: undefined;
    tool_name: undefined;
  }

  // Функция обработки данных стрима
  function processStreamData(data: StreamMessage) {
    switch (data.t) {
      case 'new':
        currentChatId.value = data.chat_id;
        messages.value.push({
          id: undefined,
          text: '',
          role: 'assistant',
          progress: true,
          tool_id: undefined,
          tool_name: undefined,
        });
        break;
      case 'delta':
        messages.value[messages.value.length - 1].text += data.text;
        break;
      case 'chat_name':
        chats.value = [
          {
            id: currentChatId.value,
            display_name: 'Новый чат',
            created_at: Date.now(),
          } as Chat,
        ].concat(chats.value);
        const chat = chats.value.find((chat) => chat.id === data.chat_id);
        if (chat) {
          chat.display_name = data.text;
        }
        break;
      case 'done':
        console.log('Message fully received:', data.text);
        const message1 = messages.value[messages.value.length - 1];
        if (message1) {
          message1.text = data.text + '\n';
          message1.progress = false;
        }
        fetchActualSubscription();
        break;
      case 'tool_new':
        const tmp = messages.value.pop();
        messages.value.push({
          id: undefined,
          text: data.text,
          role: 'tool',
          progress: true,
          tool_name: data.tool_name,
          tool_id: data.tool_id,
        });
        messages.value.push(tmp!);
        break;
      case 'tool_upd':
        const msg1 = messages.value.find((m) => m.tool_id == data.tool_id);
        if (msg1) {
          msg1.text = data.text;
        }
        break;
      case 'tool_result':
        const msg2 = messages.value.find((m) => m.tool_id == data.tool_id);
        console.log(msg2);
        if (msg2) {
          msg2.progress = false;
        }
        break;
      case 'tool_error':
        const msg = messages.value.find((m) => m.tool_id == data.tool_id);
        if (msg) {
          msg.progress = false;
          msg.text = data.text;
        }
        break;
      default:
        console.warn('Unknown message type:', data.t);
    }
  }

  return {
    chats,
    messages,
    currentChatId,
    isLoading,
    currentChat,
    currentUser,
    currentSubscription,
    sendMessage,
    listChats,
    fetchChatMessages,
    deleteChat,
    renameChat,
    login,
    logout,
    fetchUser,
    purchase,
    fetchActualSubscription,
  };
});
