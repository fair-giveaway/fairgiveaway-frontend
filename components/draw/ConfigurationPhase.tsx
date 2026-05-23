import Toggle from '../ui/Toggle';
import SlideDown from '../ui/SlideDown';
import Stepper from '../ui/Stepper';

export interface ConfigProps {
  mustLike: boolean;
  setMustLike: (v: boolean) => void;
  mustComment: boolean;
  setMustComment: (v: boolean) => void;
  mustFollow: boolean;
  setMustFollow: (v: boolean) => void;
  followUsernames: string[];
  setFollowUsernames: (v: string[]) => void;
  mustExternal: boolean;
  setMustExternal: (v: boolean) => void;
  externalUrl: string;
  setExternalUrl: (v: string) => void;
  extMustLike: boolean;
  setExtMustLike: (v: boolean) => void;
  extMustRepost: boolean;
  setExtMustRepost: (v: boolean) => void;
  extMustComment: boolean;
  setExtMustComment: (v: boolean) => void;
  extMustQuote: boolean;
  setExtMustQuote: (v: boolean) => void;
  mustPfp: boolean;
  setMustPfp: (v: boolean) => void;
  mustBio: boolean;
  setMustBio: (v: boolean) => void;
  mustAge: boolean;
  setMustAge: (v: boolean) => void;
  minMonths: number;
  setMinMonths: (v: number) => void;
  mustActivity: boolean;
  setMustActivity: (v: boolean) => void;
  minPosts: number;
  setMinPosts: (v: number) => void;
}

function ToggleRow({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl border border-borderSubtle bg-bgBase">
      <label htmlFor={id} className="text-sm text-textSecondary cursor-pointer">{label}</label>
      <Toggle checked={checked} onChange={onChange} id={id} />
    </div>
  );
}

export default function ConfigurationPhase(p: ConfigProps) {
  return (
    <div className="space-y-5">
      {/* Engagement Tasks */}
      <div>
        <span className="neo-label-sm mb-3 block">Engagement Tasks</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <ToggleRow id="t-like" label="Like post" checked={p.mustLike} onChange={p.setMustLike} />
          <ToggleRow id="t-comment" label="Comment on post" checked={p.mustComment} onChange={p.setMustComment} />

          {/* Follow — spans full width (Blurred due to X API limits) */}
          <div className="sm:col-span-2 p-2.5 rounded-xl border border-borderSubtle bg-bgBase opacity-50 relative pointer-events-none">
            <div className="flex items-center justify-between">
              <label htmlFor="t-follow" className="text-sm text-textSecondary cursor-pointer">Follow host / sponsors (Disabled)</label>
              <Toggle checked={false} onChange={() => {}} id="t-follow" />
            </div>
            <p className="text-[10px] text-textMuted mt-1">Due to X&apos;s anti-scraping limits, verifying followers programmatically is currently not supported.</p>
          </div>

          {/* External interaction — spans full width (Under development) */}
          <div className="sm:col-span-2 p-2.5 rounded-xl border border-borderSubtle bg-bgBase opacity-50 relative pointer-events-none">
            <div className="flex items-center justify-between">
              <label htmlFor="t-external" className="text-sm text-textSecondary cursor-pointer">External post interaction (Under development)</label>
              <Toggle checked={false} onChange={() => {}} id="t-external" />
            </div>
            {/* <SlideDown open={p.mustExternal} tall>
              <div className="pt-2 border-t border-borderSubtle space-y-2.5">
                <input
                  type="text" value={p.externalUrl} placeholder="https://x.com/sponsor/status/..."
                  onChange={(e) => p.setExternalUrl(e.target.value)}
                  className="neo-input py-2 text-sm"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <ToggleRow id="e-like" label="Like" checked={p.extMustLike} onChange={p.setExtMustLike} />
                  <ToggleRow id="e-repost" label="Repost" checked={p.extMustRepost} onChange={p.setExtMustRepost} />
                  <ToggleRow id="e-comment" label="Comment" checked={p.extMustComment} onChange={p.setExtMustComment} />
                  <ToggleRow id="e-quote" label="Quote" checked={p.extMustQuote} onChange={p.setExtMustQuote} />
                </div>
              </div>
            </SlideDown> */}
          </div>
        </div>
      </div>

      <hr className="border-borderSubtle" />

      {/* Anti-Bot Filters */}
      <div>
        <span className="neo-label-sm mb-3 block">Anti-Bot Filters</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <ToggleRow id="t-pfp" label="Has PFP & Banner" checked={p.mustPfp} onChange={p.setMustPfp} />
          <ToggleRow id="t-bio" label="Has Bio text" checked={p.mustBio} onChange={p.setMustBio} />

          <div className="p-2.5 rounded-xl border border-borderSubtle bg-bgBase">
            <div className="flex items-center justify-between">
              <label htmlFor="t-age" className="text-sm text-textSecondary cursor-pointer">Min account age</label>
              <Toggle checked={p.mustAge} onChange={p.setMustAge} id="t-age" />
            </div>
            <SlideDown open={p.mustAge}>
              <div className="pt-2 border-t border-borderSubtle">
                <Stepper label="" value={p.minMonths} min={1} onChange={p.setMinMonths} />
                <span className="text-[10px] text-textMuted mt-1 block">months old</span>
              </div>
            </SlideDown>
          </div>

          <div className="p-2.5 rounded-xl border border-borderSubtle bg-bgBase">
            <div className="flex items-center justify-between">
              <label htmlFor="t-activity" className="text-sm text-textSecondary cursor-pointer">Min post count</label>
              <Toggle checked={p.mustActivity} onChange={p.setMustActivity} id="t-activity" />
            </div>
            <SlideDown open={p.mustActivity}>
              <div className="pt-2 border-t border-borderSubtle">
                <Stepper label="" value={p.minPosts} min={1} onChange={p.setMinPosts} />
                <span className="text-[10px] text-textMuted mt-1 block">posts minimum</span>
              </div>
            </SlideDown>
          </div>
        </div>
      </div>
    </div>
  );
}
