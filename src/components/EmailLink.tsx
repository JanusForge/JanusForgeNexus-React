"use client";

interface EmailLinkProps {
  email: string;
  children: React.ReactNode;
  className?: string;
}

export default function EmailLink({ email, children, className = "" }: EmailLinkProps) {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`mailto:${email}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleEmailClick}
      className={`text-blue-400 hover:text-blue-300 cursor-pointer ${className}`}
      title={`Click to email ${email} (opens in new tab)`}
    >
      {children}
    </button>
  );
}
