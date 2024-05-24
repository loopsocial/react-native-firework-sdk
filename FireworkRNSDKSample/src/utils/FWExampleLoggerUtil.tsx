interface LoggerOptions {
  name?: string;
  shouldCache?: boolean;
}

export default class FWExampleLoggerUtil {
  private static messageList: string[] = [];

  static log(options: LoggerOptions = {}, ...messages: any[]): void {
    const { name = 'com.loopnow.bogano_example', shouldCache = false } =
      options;

    messages = messages.map((msg) =>
      typeof msg === 'object' ? JSON.stringify(msg) : msg
    );

    const combinedMessage = messages.join(' ');
    const message = `[${name}] ${combinedMessage}`;

    console.log(message);

    if (shouldCache) {
      FWExampleLoggerUtil.messageList.push(`${message}`);
    }
  }

  static getMessages(): string[] {
    return FWExampleLoggerUtil.messageList;
  }

  static clearMessages(): void {
    FWExampleLoggerUtil.messageList = [];
  }
}
