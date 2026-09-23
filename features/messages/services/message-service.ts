import {
  LOCAL_MESSAGE_NOTICE,
  localMessageSchema,
  messageThreadListSchema,
  messageThreadSchema,
  sendMessageInputSchema,
  type LocalMessage,
  type MessageThread,
  type SendMessageInput,
} from "@/features/messages/schema";
import {
  createLocalCollection,
  type LocalPersistence,
  type LocalServiceData,
} from "@/lib/local-collection";
import {
  serviceFailure,
  serviceSuccess,
  type ServiceResult,
} from "@/lib/service-result";
import {
  createVersionedStorage,
  type StorageProvider,
} from "@/lib/storage/versioned-storage";
import { validationFailure } from "@/lib/validation";
import { MESSAGE_THREAD_FIXTURES } from "@/mocks/messages";

const SEND_TIMESTAMP = "2026-01-15T12:00:00.000Z";

export type MessageService = {
  getThread: (
    id: string,
  ) => Promise<ServiceResult<LocalServiceData<MessageThread>>>;
  listThreads: () => Promise<
    ServiceResult<LocalServiceData<readonly MessageThread[]>>
  >;
  reset: () => Promise<
    ServiceResult<LocalServiceData<readonly MessageThread[]>>
  >;
  send: (
    input: SendMessageInput,
  ) => Promise<ServiceResult<LocalServiceData<LocalMessage>>>;
};

function entityResult<T>(value: T, persistence: LocalPersistence) {
  return serviceSuccess({ value, persistence });
}

function nextMessageId(threads: readonly MessageThread[]) {
  const messages = threads.flatMap((thread) => thread.messages);
  let sequence = 1;
  while (messages.some(({ id }) => id === `message-local-${sequence}`)) {
    sequence += 1;
  }
  return `message-local-${sequence}`;
}

export function createMessageService(
  options: { getStorage?: StorageProvider } = {},
): MessageService {
  const collection = createLocalCollection<MessageThread>({
    cloneItem: (thread) => ({
      ...thread,
      participantIds: [...thread.participantIds],
      messages: thread.messages.map((message) => ({ ...message })),
    }),
    fixtures: MESSAGE_THREAD_FIXTURES,
    storage: createVersionedStorage({
      name: "message-threads",
      version: 1,
      schema: messageThreadListSchema,
      getStorage: options.getStorage,
    }),
  });

  return {
    async getThread(id) {
      const current = collection.snapshot();
      if (!current.ok) return current;
      const thread = current.data.value.find((item) => item.id === id);
      return thread
        ? entityResult(thread, current.data.persistence)
        : serviceFailure("NOT_FOUND", "Message thread was not found.");
    },
    async listThreads() {
      return collection.snapshot();
    },
    async reset() {
      return collection.reset();
    },
    async send(input) {
      const validated = sendMessageInputSchema.safeParse(input);
      if (!validated.success) {
        return validationFailure(
          "Local message input is invalid.",
          validated.error,
        );
      }
      const current = collection.snapshot();
      if (!current.ok) return current;
      const index = current.data.value.findIndex(
        (thread) => thread.id === validated.data.threadId,
      );
      if (index < 0) {
        return serviceFailure("NOT_FOUND", "Message thread was not found.");
      }
      const thread = current.data.value[index];
      if (!thread.participantIds.includes(validated.data.authorId)) {
        return serviceFailure(
          "FORBIDDEN",
          "The selected demo identity is not a participant in this local thread.",
        );
      }
      const message = localMessageSchema.parse({
        id: nextMessageId(current.data.value),
        authorId: validated.data.authorId,
        body: validated.data.body,
        sentAt: SEND_TIMESTAMP,
        delivery: "local-simulation",
        deliveryNotice: LOCAL_MESSAGE_NOTICE,
      });
      const updatedThread = messageThreadSchema.parse({
        ...thread,
        messages: [...thread.messages, message],
        updatedAt: SEND_TIMESTAMP,
      });
      const next = [...current.data.value];
      next[index] = updatedThread;
      const committed = collection.commit(next);
      if (!committed.ok) return committed;
      return entityResult(message, committed.data.persistence);
    },
  };
}
