import { print } from 'kolmafia';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logColor = (color: string) => (...args: any[]) => {
  print(args.map(x => x.toString()).join(' '), color);
};

export default {
  log: logColor('black'),
  info: logColor('blue'),
  warn: logColor('red'),
  error: logColor('red'),
  trace: () => {},
};
