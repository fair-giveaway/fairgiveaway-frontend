export default function ParticipantList({ participants }: { participants: string[] }) {
  return (
    <div className="max-h-36 overflow-y-auto rounded-xl border border-borderStrong bg-bgBase p-3 shadow-inner">
      <div className="flex flex-wrap gap-1.5">
        {participants.map((p, i) => (
          <span key={i} className="text-[11px] text-textSecondary truncate px-1.5 py-0.5 rounded-md bg-bgElevated border border-borderSubtle">
            @{p}
          </span>
        ))}
      </div>
    </div>
  );
}
