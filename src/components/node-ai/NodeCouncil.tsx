// Find the rendering logic in your return statement and replace it with this:

{(() => {
  const content = msg.content || "";
  
  // 🏛️ REFINED REGEX: Handles spaces and different backtick styles
  const mermaidRegex = /```(?:mermaid)?\s*([\s\S]*?)\s*```/;
  const match = content.match(mermaidRegex);

  if (match && match[1]) {
    const chartCode = match[1].trim();
    const textParts = content.split(mermaidRegex);

    return (
      <div className="space-y-4 w-full">
        {textParts[0] && <p className="whitespace-pre-wrap">{textParts[0].trim()}</p>}
        
        {/* Render the chart in its own block */}
        <MermaidViewer chart={chartCode} />

        {textParts[textParts.length - 1] && (
          <p className="whitespace-pre-wrap">{textParts[textParts.length - 1].trim()}</p>
        )}
      </div>
    );
  }

  // Final fallback for naked code strings
  if (content.trim().startsWith('graph') || content.trim().startsWith('flowchart')) {
    return <MermaidViewer chart={content.trim()} />;
  }

  return <p className="whitespace-pre-wrap">{content}</p>;
})()}
