import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Chat } from 'src/models/Chat';
import { Message } from 'src/models/Message';
import { Subscription, User } from 'src/models/User';
import { useQuasar } from 'quasar';
import { getMaterialFileIcon } from 'file-extension-icon-js';
import { Instruction } from 'src/models/Instruction';

const API_BASE = process.env.API_BASE;

declare global {
  interface Tmr {
    push(a0: object): void;
  }

  interface Window {
    ym(a0: number, a1: string, a2: string): void;
    _tmr: Tmr;
    p(a0: string): void;
    mp(): void;
    YooMoneyCheckoutWidget: typeof YooMoneyCheckoutWidget;
  }
}

declare class YooMoneyCheckoutWidget {
  constructor(a0: object);
  render(a0?: string): void;
}

export const useChatStore = defineStore('chatStore', () => {
  const chats = ref<Chat[]>([]);
  const messages = ref<Message[]>([]);
  const currentChatId = ref<string | null>(null);

  const isMessageLoading = ref<boolean>(false);
  const isUserLoading = ref<boolean>(false);
  const isChatListLoading = ref<boolean>(false);
  const isChatLoading = ref<boolean>(false);
  const isSubLoading = ref<boolean>(false);
  const isShowPlans = ref<boolean>(false);
  const isShowPaymentDialog = ref<boolean>(false);
  const showSignInForm = ref(false);

  const isShowMiniPlans = ref<boolean>(false);
  const miniPlansTitle = ref('Прикреплять файлы можно в подписке!');

  const currentUser = ref<User | null>(null);
  const currentSubscription = ref<Subscription | null>(null);
  const subscriptionHistory = ref<Subscription[]>([]);

  const atLeastOneMessageSentNow = ref<boolean>(false);

  const paymentConfirmationToken = ref<string | null>(null);
  const paymentSubType = ref<string>('base1');

  const userInstruction = ref<Instruction | null>(null);

  const model = ref('gpt-4o-mini');

  const $q = useQuasar();

  const currentChat = computed((): Chat | undefined => {
    // console.log(currentChatId.value);
    if (!currentChatId.value) return undefined;
    return chats.value.find((c) => c.id == currentChatId.value);
  });

  const createErrorNotification = (
    message: string,
    type: string = 'warning',
    icon: string = 'eva-alert-circle-outline',
  ) => {
    $q.notify({
      type: type, // Тип уведомления (ошибка)
      message: message, // Текст сообщения
      position: 'top', // Позиция уведомления (вверху экрана)
      html: true,
      icon: icon,
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
    isSubLoading.value = true;
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
    isSubLoading.value = false;
  }

  async function cancelSubscription() {
    if (currentSubscription.value) {
      isSubLoading.value = true;

      try {
        const response = await fetch(
          `${API_BASE}/subscriptions/${currentSubscription.value._id}/cancel`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );
        if (response.ok) {
          await fetchActualSubscription();
          createErrorNotification((await response.json()).message);
        } else {
          currentSubscription.value = null;
        }
      } catch (e) {
        currentSubscription.value = null;
      }
      isSubLoading.value = false;
    }
  }

  async function listSubscriptions() {
    isSubLoading.value = true;
    try {
      const response = await fetch(`${API_BASE}/subscriptions`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        subscriptionHistory.value = await response.json();
      } else {
        subscriptionHistory.value = [];
      }
    } catch (e) {
      subscriptionHistory.value = [];
    }
    isSubLoading.value = false;
  }

  async function fetchUser() {
    isUserLoading.value = true;
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        currentUser.value = await response.json();
        window.ym && window.ym(98810411, 'setUserID', currentUser.value!.id);
      } else {
        currentUser.value = null;
      }
    } catch (e) {
      currentUser.value = null;
    }
    isUserLoading.value = false;
  }

  async function fetchUserInstruction() {
    try {
      const response = await fetch(`${API_BASE}/instructions/mine`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        userInstruction.value = await response.json();
      } else {
        userInstruction.value = null;
      }
    } catch (e) {
      userInstruction.value = null;
    }
  }

  async function saveUserInstruction() {
    try {
      const response = await fetch(`${API_BASE}/instructions/mine`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInstruction.value),
      });
      if (response.ok) {
        userInstruction.value = await response.json();
        createErrorNotification('Инструкции применены');
        window.ym && window.ym(98810411, 'reachGoal', 'SAVE_USER_INSTRUCTION');
      } else {
        userInstruction.value = null;
      }
    } catch (e) {
      userInstruction.value = null;
    }
  }

  async function listChats() {
    isChatListLoading.value = true;
    try {
      const response = await fetch(`${API_BASE}/chats`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        chats.value = await response.json();
      } else {
        chats.value = [];
      }
    } catch (e) {
      console.log(e);
      chats.value = [];
    }
    isChatListLoading.value = false;
  }

  async function purchase(
    type: string,
    promoCode: string | undefined = undefined,
  ) {
    // try {
    const response = await fetch(`${API_BASE}/subscriptions/purchase`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, promo_code: promoCode }),
    });

    if (!response.ok) {
      if (response.status == 401) {
        showSignInForm.value = true;
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail ||
          'Не удалось выполнить покупку. Пожалуйста, попробуйте снова.';
        createErrorNotification(errorMessage);
      }
    } else {
      const resp = await response.json();
      console.log(resp);

      if (resp.confirmation_token) {
        paymentConfirmationToken.value = resp.confirmation_token;
        paymentSubType.value = type;
        isShowPlans.value = false;
        isShowMiniPlans.value = false;
        isShowPaymentDialog.value = true;
      } else {
        window.location.href = resp.payment_url;
      }
    }
  }

  async function subscribeEmail(topic: string) {
    try {
      const response = await fetch(`${API_BASE}/user_actions/subscribe_email`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (response.ok) {
        const resp = await response.json();
        createErrorNotification(resp.message, 'primary');
      }
    } catch (e) {
      createErrorNotification('Произошла ошибка во время подписки.');
    }
  }

  async function rate(rating: number, payload: string = '') {
    const response = await fetch(`${API_BASE}/user_actions/rating`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, payload, chat_id: currentChatId.value }),
    });

    if (response.ok) {
      const resp = await response.json();
      createErrorNotification(resp.message);
    }

    window.ym && window.ym(98810411, 'reachGoal', `RATING_${rating}`);
  }

  async function checkHealth() {
    await fetch(`${API_BASE}/health`, {
      method: 'GET',
      credentials: 'include',
    });
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

  async function patchChat(
    chat: Chat,
    newName: string | null = null,
    isShared: boolean | null = null,
    isStarred: boolean | null = null,
  ) {
    await fetch(`${API_BASE}/chats/${chat.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: newName == null ? chat.display_name : newName,
        is_shared: isShared == null ? chat.is_shared : isShared,
        is_starred: isStarred == null ? chat.is_starred : isStarred,
      }),
      credentials: 'include',
    });
    await listChats();
  }

  async function fetchChatMessages(chatId: string) {
    isChatLoading.value = true;
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
    isChatLoading.value = false;
  }

  async function fetchSharedChatMessages(chatId: string) {
    isChatLoading.value = true;
    try {
      currentChatId.value = chatId;
      const response = await fetch(
        `${API_BASE}/chats/shared/${currentChatId.value}`,
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
    isChatLoading.value = false;
  }

  async function checkMessagesCount() {
    if (currentSubscription.value) {
      const delta =
        currentSubscription.value?.message_per_day_limit -
        currentSubscription.value.messages_in_last_day;
      if (delta < 1) {
        // miniPlansTitle.value = 'Не осталось сообщений на сегодня';
        // isShowMiniPlans.value = true;

        window.ym && window.ym(98810411, 'reachGoal', 'REACH_LIMIT');
      }
    }
  }

  async function fileToBase64(file: File) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // Функция для инициализации чата с стримингом сообщений
  async function sendMessage(text: string, file: File | null = null) {
    messages.value.push({
      id: undefined,
      text,
      role: 'user',
      progress: false,
      tool_id: undefined,
      tool_name: undefined,
      attachments: file
        ? file.type.startsWith('image')
          ? [URL.createObjectURL(file)]
          : [getMaterialFileIcon(file.name)]
        : undefined,
    });

    isMessageLoading.value = true;

    if (currentUser.value == null) {
      messages.value.push({
        id: undefined,
        text: '',
        role: 'assistant',
        progress: true,
        tool_id: undefined,
        tool_name: undefined,
      });
      localStorage.setItem('stagedMessage', text);
      setTimeout(() => {
        showSignInForm.value = true;
        isMessageLoading.value = false;
      }, 800);
      return;
    }

    localStorage.removeItem('stagedMessage');

    const response = await fetch(
      currentChatId.value
        ? `${API_BASE}/chats/${currentChatId.value}/messages`
        : `${API_BASE}/chats`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          attachments: file
            ? [{ filename: file.name, data_str: await fileToBase64(file) }]
            : null,
          model: model.value,
        }),
        credentials: 'include',
      },
    );

    atLeastOneMessageSentNow.value = true;

    if (!response.ok) {
      const d = await response.json();
      if (response.status == 429 && d.detail.includes('msg_quota')) {
        miniPlansTitle.value = 'Не осталось сообщений на сегодня!';
        isShowMiniPlans.value = true;

        window.ym && window.ym(98810411, 'reachGoal', 'REACH_LIMIT');
      } else {
        createErrorNotification(d.detail);
      }
      isMessageLoading.value = false;
      return;
    }

    if (!response.body) {
      isMessageLoading.value = false;
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
            // console.log('Stream finished');
            isMessageLoading.value = false;
            window.ym && window.ym(98810411, 'reachGoal', 'RECEIVE_MESSAGE');
            window._tmr &&
              window._tmr.push({
                type: 'reachGoal',
                id: 3591987,
                goal: 'RECEIVE_MESSAGE',
              });
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
                isMessageLoading.value = false;
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
        // console.log('Message fully received:', data.text);
        const message1 = messages.value[messages.value.length - 1];
        if (message1) {
          message1.text = data.text + '\n';
          message1.progress = false;
        }
        fetchActualSubscription().then(checkMessagesCount);
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
        // console.log(msg2);
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
    isMessageLoading,
    isUserLoading,
    isChatLoading,
    isChatListLoading,
    isSubLoading,
    isShowPlans,
    isShowMiniPlans,
    atLeastOneMessageSentNow,
    miniPlansTitle,
    currentChat,
    currentUser,
    currentSubscription,
    subscriptionHistory,
    showSignInForm,
    isShowPaymentDialog,
    paymentConfirmationToken,
    paymentSubType,
    userInstruction,
    model,
    sendMessage,
    listChats,
    fetchChatMessages,
    deleteChat,
    patchChat,
    login,
    logout,
    fetchUser,
    purchase,
    fetchActualSubscription,
    listSubscriptions,
    cancelSubscription,
    subscribeEmail,
    fetchSharedChatMessages,
    checkHealth,
    rate,
    createErrorNotification,
    fetchUserInstruction,
    saveUserInstruction,
  };
});
