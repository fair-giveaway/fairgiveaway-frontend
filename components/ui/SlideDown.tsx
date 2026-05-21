export default function SlideDown({ open, children, tall }: { open: boolean; children: React.ReactNode; tall?: boolean }) {
  const height = tall ? 'max-h-[500px]' : 'max-h-24';
  return (
    <div className={`overflow-hidden transition-all duration-300 ${open ? `${height} opacity-100 mt-3` : 'max-h-0 opacity-0'}`}>
      {children}
    </div>
  );
}
