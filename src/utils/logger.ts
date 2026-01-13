type LogMeta = Record<string, unknown>;

type LogLevel = "debug" | "info" | "warn" | "error" | "http";

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m", // cyan
  info: "\x1b[32m",  // green
  warn: "\x1b[33m",  // yellow
  error: "\x1b[31m", // red
  http: "\x1b[35m",  // magenta
};

const RESET = "\x1b[0m";

function format(level: LogLevel, message: string, meta?: LogMeta): string {
  const timestamp = new Date().toISOString();
  const color = LOG_COLORS[level];
  const levelStr = `${color}${level.toUpperCase().padEnd(5)}${RESET}`;
  
  const baseLog = `[${timestamp}] ${levelStr} ${message}`;
  return meta ? `${baseLog} ${JSON.stringify(meta)}` : baseLog;
}

export const logger = {
  debug(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV !== "production") {
      console.log(format("debug", message, meta));
    }
  },

  info(message: string, meta?: LogMeta) {
    console.log(format("info", message, meta));
  },

  warn(message: string, meta?: LogMeta) {
    console.warn(format("warn", message, meta));
  },

  error(message: string, meta?: LogMeta) {
    console.error(format("error", message, meta));
  },

  http(message: string, meta?: LogMeta) {
    console.log(format("http", message, meta));
  },

  // Stream for morgan integration
  stream: {
    write(message: string) {
      // Remove trailing newline from morgan
      logger.http(message.trim());
    },
  },
};
