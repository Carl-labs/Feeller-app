import { Minus, Square, X } from "lucide-react";

export function TitleBar() {
    const handle = (action: 'minimize' | 'maximize' | 'close') => {
      // @ts-ignore – exposed via preload
      window.electron?.[action]?.();
    };
  
    return (
      <div
        className="fixed w-full h-[36px] text-black flex items-center justify-between select-none" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
        <img src="/icon.png" className="absolute top-0 ml-[14px] mt-[6px] w-[28px] h-[28px]"/>
  
        <div className="absolute right-0 top-0 flex items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <button onClick={() => handle('minimize')} className="h-[28px] w-[40px] flex items-center justify-center hover:bg-[#efefef]" title="Minimize">
            <Minus size={12}/>
          </button>
          <button onClick={() => handle('maximize')} className="h-[28px] w-[40px] flex items-center justify-center hover:bg-[#efefef]" title="Maximize">
            <Square size={10}/>
          </button>
          <button onClick={() => handle('close')} className="h-[28px] w-[40px] flex items-center justify-center hover:bg-[#ff0000] hover:text-[white]" title="Close">
            <X size={16}/>
          </button>
        </div>
      </div>
    );
}  