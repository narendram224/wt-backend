import { format, createLogger, addColors, transports } from 'winston';
import { sep, join } from 'path';
const { combine, timestamp, label, printf, colorize, align } = format;
import { NODE_ENV } from '.';
import 'winston-daily-rotate-file';

const roomFilter = format((info) => {
    const labelValue = info[Object.getOwnPropertySymbols(info)[0]];

    return labelValue == 'room' ? info : false;
});
const errorFilter = format((info) => {
    const labelValue = info[Object.getOwnPropertySymbols(info)[0]];
    return labelValue == 'error' ? info : false;
});

const infoFilter = format((info) => {
    const labelValue = info[Object.getOwnPropertySymbols(info)[0]];
    return labelValue == 'info' ? info : false;
});

const levels = {
    levels: {
        product: 1,
        error: 1,
        warn: 3,
        info: 4,
        debug: 5,
        room: 6,
    },
    colors: {
        product: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        debug: 'blue',
        room: 'magenta',
    },
};

let getLabel = (callingModule) => {
    //To support files which don't have an module
    if (typeof callingModule == 'string') {
        return callingModule;
    }
    let parts = callingModule.filename.split(sep);
    return join(parts[parts.length - 2], parts.pop());
};

const consoleLogger = (callingModule) => {
    const logger = createLogger({
        levels: levels.levels,
        exitOnError: false,
        format: combine(
            colorize(),
            timestamp({
                format: 'DD-MM-YYYY HH:mm:ss',
            }),
            align(),
            label({ label: getLabel(callingModule) }),
            printf(
                (info) =>
                    `[${info.timestamp}] [${info.level}] [${info.label}]: ${info.message}`
            )
        ),
        transports: [
            new transports.DailyRotateFile({
                name: 'Info logs',
                filename: 'logs/info-%DATE%.log',
                datePattern: 'DD-MMM-YYYY',
                level: 'info',
                maxSize: '20m',
                maxFiles: '14d',
                format: format.combine(infoFilter()),
            }),
            new transports.DailyRotateFile({
                name: 'Prod logs',
                filename: 'logs/product-%DATE%.log',
                datePattern: 'DD-MMM-YYYY',
                level: 'debug',
                maxSize: '10m',
                maxFiles: '30d',
            }),

            new transports.DailyRotateFile({
                filename: 'logs/error-%DATE%.log',
                datePattern: 'DD-MMM-YYYY',
                level: 'error',
                name: 'Error logs',
                maxSize: '5m',
                maxFiles: '14d',
                format: format.combine(errorFilter()),
            }),
            new transports.DailyRotateFile({
                filename: 'logs/room-%DATE%.log',
                datePattern: 'DD-MMM-YYYY',
                level: 'room',
                name: 'Room logs',
                maxSize: '20m',
                maxFiles: '14d',
                roomData: true,
                format: format.combine(roomFilter()),
            }),
        ],
    });
    addColors(levels.colors);

    if (NODE_ENV === 'development') {
        logger.add(
            new transports.Console({
                name: 'Debug logs',
                level: 'debug',
                label: getLabel(callingModule),
                prettyPrint: function (object) {
                    return JSON.stringify(object);
                },
            })
        );
    } else if (NODE_ENV === 'production') {
        logger.add(
            new transports.DailyRotateFile({
                name: 'Combined logs',
                filename: 'logs/server/%DATE%/combined.log',
                // filename: "logs/combined-%DATE%.log",
                level: 'error',
                datePattern: 'YYYY-MM-DD-HH',
                maxSize: '20m',
                maxFiles: '14d',
            })
        );
    }

    logger.stream = {
        write: (message) => {
            logger.info(message);
        },
    };

    return logger;
};

export default consoleLogger;
