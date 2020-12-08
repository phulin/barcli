import { Fragment, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Global } from '@emotion/react';
import GcliDisplay from './GcliDisplay';
import useInterval from '../hooks/useInterval';
import GcliInput from './GcliInput';

const LINE_COUNT_LIMIT = 300;

const getFrameset = (theWindow: Window) => {
  return theWindow.frameElement.closest('frameset');
};

const expandFrameListener = (inputRef: RefObject<HTMLInputElement>, event: KeyboardEvent) => {
  const activeElement = (top.document.activeElement as HTMLFrameElement)?.contentDocument?.activeElement;
  if (
    inputRef.current &&
    inputRef.current.ownerDocument.defaultView &&
    event.key === '`' &&
    (!activeElement ||
      activeElement.tagName.toLowerCase() !== 'input' ||
      activeElement.getAttribute('type') !== 'text' ||
      (activeElement as HTMLInputElement).disabled)
  ) {
    const framesetElement = getFrameset(inputRef.current.ownerDocument.defaultView);
    event.preventDefault();
    framesetElement?.setAttribute('rows', '50%,50%');
    inputRef.current?.focus();
  }
};

const unloadFrameCallback = (frame: Window, onKeyDown: (event: KeyboardEvent) => void) => {
  top.setTimeout(() => {
    frame.onkeydown = onKeyDown;
    frame.addEventListener('unload', unloadFrameCallback.bind(null, frame, onKeyDown));
  }, 10);
};

const App = () => {
  const [gcliContents, setGcliContents] = useState([] as { id: number; text: string; lineCount: number }[]);
  const displayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pwd = useMemo(() => document.getElementsByTagName('body')[0]?.getAttribute('data-pwd') || '', []);

  const handleKeyDown = useMemo(() => expandFrameListener.bind(null, inputRef), [inputRef]);

  const handleUnloadFrame = useCallback(frame => unloadFrameCallback(frame, handleKeyDown), [handleKeyDown]);

  useEffect(() => {
    for (let i = 0; i < top.frames.length; i++) {
      const frame = top.frames[i];
      frame.onkeydown = handleKeyDown;
      frame.addEventListener('unload', handleUnloadFrame.bind(null, frame));
    }
    top.onkeydown = handleKeyDown;
    top.frames[1].addEventListener('keydown', event => {
      if (event.key === 'Esc' || event.key === 'Escape') {
        getFrameset(top.frames[1])?.setAttribute('rows', '42,*');
        inputRef.current?.blur();
      }
    });
  }, [inputRef, handleKeyDown, handleUnloadFrame]);

  const updateContents = useCallback(async () => {
    // Every time we update, make sure our event listeners aren't messed up...
    for (let i = 0; i < top.frames.length; i++) {
      const frame = top.frames[i];
      frame.onkeydown = handleKeyDown;
    }
    try {
      const response = await fetch(`/KoLmafia/messageUpdate?pwd=${pwd}`);
      const html = await response.text();
      if (html.trim().length > 0) {
        setGcliContents(gcliContents => {
          // Trim so we have at most LINE_COUNT_LIMIT lines.
          const lineCount = (html.match(/<br ?\/?>/g) || []).length;
          let totalLineCount = gcliContents.reduce((sum, chunk) => sum + chunk.lineCount, 0) + lineCount;
          let keepIndex = 0;
          for (; keepIndex < gcliContents.length; keepIndex++) {
            if (totalLineCount <= LINE_COUNT_LIMIT) break;
            totalLineCount -= gcliContents[keepIndex].lineCount;
          }
          console.assert(totalLineCount >= lineCount);
          return [...gcliContents.slice(keepIndex), { id: new Date().getTime(), text: html, lineCount }];
        });
        displayRef.current?.scrollTo(0, displayRef.current?.scrollHeight);
      }
    } catch (e) {
      console.log(e);
    }
  }, [displayRef, handleKeyDown]);

  const handleCommand = useCallback(
    async command => {
      try {
        if (inputRef.current !== null) inputRef.current.value = '';
        await fetch(`/KoLmafia/submitCommand?pwd=${pwd}&cmd=${command}`, {
          method: 'GET',
        });
        for (const delayMs of [100, 200, 200, 200, 300, 300, 300, 300]) {
          setTimeout(updateContents, delayMs);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [pwd]
  );

  useInterval(updateContents, 2000);

  return (
    <Fragment>
      <Global
        styles={{
          '#react-root': {
            height: 'calc(100% - 33px - 0.5rem)',
          },
          '#react-root *': {
            boxSizing: 'border-box',
          },
          '#awesome': {
            overflow: 'visible',
            height: '100%',
          },
        }}
      />
      <div
        css={{
          margin: '0.5rem -3px 0 -3px',
          padding: '0 6px',
          width: '100vw',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <GcliDisplay contents={gcliContents} innerRef={displayRef} />
        <GcliInput onCommand={handleCommand} innerRef={inputRef} />
      </div>
    </Fragment>
  );
};

export default App;
