export default function Conversations({ convoId }: { convoId: string }) {
  if (!convoId) {
    return <div>No conversation selected</div>;
  }
  return <div></div>;
}
