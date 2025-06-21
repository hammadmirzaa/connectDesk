export function MessageFileBubble({ fileUrl, fileName, mimeType, fileSize, pdfPages }) {
    const icons = {
  pdf: (
    <svg width="36" height="36" viewBox="0 0 36 36"><rect fill="#F40F02" x="0" y="0" width="36" height="36" rx="8"/><text x="4" y="26" fontSize="16" fontWeight="bold" fill="#fff">PDF</text></svg>
  ),
  doc: (
    <svg width="36" height="36" viewBox="0 0 36 36"><rect fill="#2156F4" x="0" y="0" width="36" height="36" rx="8"/><text x="4" y="26" fontSize="16" fontWeight="bold" fill="#fff">DOC</text></svg>
  ),
  image: (
    <svg width="36" height="36" viewBox="0 0 36 36"><rect fill="#46B44A" x="0" y="0" width="36" height="36" rx="8"/><circle cx="12" cy="12" r="5" fill="#fff"/><rect x="10" y="24" width="16" height="6" fill="#fff" rx="2"/></svg>
  ),
  file: (
    <svg width="36" height="36" viewBox="0 0 36 36"><rect fill="#AAA" x="0" y="0" width="36" height="36" rx="8"/><text x="8" y="26" fontSize="16" fontWeight="bold" fill="#fff">FILE</text></svg>
  ),
  download: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="19" width="18" height="2" rx="1" fill="#666"/></svg>
  )
};

function getFileTypeIcon(filename = "", mimetype = "") {
  if (filename.endsWith(".pdf")) return icons.pdf;
  if (filename.endsWith(".doc") || filename.endsWith(".docx")) return icons.doc;
  return icons.file;
}
function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

  const isImage = mimeType && mimeType.startsWith("image/");
  const isPDF = mimeType === "application/pdf";
    if (isImage) {
    return (
      <div className="relative inline-block max-w-[250px]">
        {/* Image only, no icon, no colored bg */}
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={fileUrl}
            alt={fileName}
            className="rounded-xl shadow max-w-[250px] max-h-[200px] object-cover"
            style={{ background: "none" }}
          />
        </a>
        {/* Download button at bottom right, overlay */}
        <a
          href={fileUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white/70 hover:bg-white shadow rounded-full p-1 flex items-center justify-center"
          title="Download"
        >
          {/* You can use a better icon library here */}
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v10m0 0l-4-4m4 4l4-4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="5" y="19" width="14" height="2" rx="1" fill="#222"/>
          </svg>
        </a>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-[#eaffea] rounded-xl px-4 py-3 shadow border border-[#b0e5b0] max-w-xs">
      <div className="flex items-center">
        {/* File type icon (reuse icons from previous answer) */}
        <div className="mr-3">{getFileTypeIcon(fileName, mimeType)}</div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="truncate text-black font-medium">{fileName}</span>
          <div className="flex gap-2 text-xs text-gray-700 mt-0.5">
            {pdfPages && <span>{pdfPages} pages</span>}
            <span>{mimeType?.split("/")[1]?.toUpperCase()}</span>
            <span>{formatFileSize(fileSize)}</span>
          </div>
        </div>
        {/* Download button */}
        <a
          href={fileUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 flex-shrink-0 hover:bg-gray-200 rounded-full p-1"
          title="Download"
        >
          {icons.download}
        </a>
      </div>
      {/* Auto-preview for images */}
      {isImage && (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={fileUrl}
            alt="preview"
            className="mt-2 max-h-36 max-w-full rounded shadow"
            style={{ objectFit: "cover" }}
          />
        </a>
      )}
    </div>
  );
}
