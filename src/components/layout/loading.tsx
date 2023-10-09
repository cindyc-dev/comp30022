import { useEffect, useState } from "react";
import { FUNNY_LOADING_PHRASES } from "~/sample_data/funnyLoadingMessages";

function Loading({
  text,
  withRandomPhrase = false,
}: {
  text?: string;
  withRandomPhrase?: boolean;
}) {
  const [loadingPhrase, setLoadingPhrase] = useState<string | undefined>(
    undefined
  );
  // Randomly generate a number between 0 to n
  const random = (n: number) => Math.floor(Math.random() * n);

  useEffect(() => {
    if (!withRandomPhrase) return;

    if (loadingPhrase === undefined) {
      // Randomly select a loading phrase
      const randomLoadingPhrase =
        FUNNY_LOADING_PHRASES[random(FUNNY_LOADING_PHRASES.length)];
      setLoadingPhrase(randomLoadingPhrase);
    }

    // Randomly select a loading phrase every 5 seconds
    const interval = setInterval(() => {
      const randomLoadingPhrase =
        FUNNY_LOADING_PHRASES[random(FUNNY_LOADING_PHRASES.length)];
      setLoadingPhrase(randomLoadingPhrase);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full flex-grow flex-col items-center justify-center gap-1">
      <h1 className="m-0">Loading</h1>
      {text && <p className="m-0">{text}</p>}
      <progress className="progress progress-primary w-56"></progress>
      {loadingPhrase && <p className="m-1">{loadingPhrase}</p>}
    </div>
  );
}

export default Loading;
