export default function RenderFormattedText(props: { text: string }) {
  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: props.text }}></div>
    </div>
  );
}
