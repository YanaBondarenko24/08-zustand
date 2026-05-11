// app/notes/error.tsx

'use client';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  return (
    <div>
      <h2>There was an error!</h2>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button onClick={reset}>Please try again...</button>
    </div>
  );
}

export default Error;
