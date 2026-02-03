                  <p className="text-sm md:text-base text-zinc-200 leading-relaxed whitespace-pre-wrap">{content}</p>
                  {activeThreadId && (
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex gap-6">
                        <button onClick={() => handleAction('like', msg.content)} className="text-zinc-600 hover:text-indigo-400"><ThumbsUp size={14}/></button>
                        <button onClick={() => handleAction('share', msg.content)} className="text-zinc-600 hover:text-indigo-400"><Share2 size={14}/></button>
                      </div>
                      {(msg.is_human || msg.type === 'user') && (
                        <button onClick={(e) => { e.stopPropagation(); toggleAnchor(msg.id); }} className={`text-[8px] font-black uppercase tracking-widest ${msg.isAnchored ? 'text-indigo-400' : 'text-zinc-700'}`}>
                          {msg.isAnchored ? '• Anchored •' : 'Anchor'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* FOOTER remains unchanged */}
      <footer className="fixed bottom-0 w-full p-8 bg-gradient-to-t from-black via-black to-transparent flex flex-col items-center z-[150]">
        <div onClick={() => isExpired && setIsTrayOpen(true)} className={`w-full max-w-3xl border rounded-[3rem] p-3 flex items-center gap-4 backdrop-blur-3xl transition-all duration-500 cursor-pointer ${ isExpired ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/50' : 'bg-zinc-950 border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.1)]' }`}>
          <textarea value={userMessage} readOnly={isExpired && user?.role !== 'ADMIN'} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())} placeholder={isExpired ? "Unlock access to contribute..." : activeThreadId ? "Reply to this thread..." : "Start a new neural pattern..."} className={`flex-1 bg-transparent outline-none resize-none h-12 py-3 px-6 text-sm ${ isExpired ? 'text-amber-500/50 italic' : 'text-white' }`} />
          <button onClick={(e) => { e.stopPropagation(); handleIgnition(); }} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${ isExpired ? 'bg-amber-600/20 text-amber-500' : 'bg-indigo-600 text-white hover:bg-indigo-500' }`}> {isSynthesizing ? <Loader2 className="animate-spin" size={20}/> : (isExpired ? <Lock size={20}/> : <Send size={20} />)} </button>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-4"><span className="text-indigo-400">Nodes Active: {chatThread.filter(m => m.is_human || m.type === 'user').length}</span><span className="opacity-30">•</span><span className="text-amber-500/70 animate-pulse">Observers: {observerCount}</span></p>
          <p className="text-[12px] font-black font-mono text-indigo-500 tracking-widest">{nexusTime} EST</p>
        </div>
      </footer>

      {/* ACCESS TRAY remains unchanged */}
      {isTrayOpen && ( <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}> <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10" onClick={e => e.stopPropagation()}> <div className="flex justify-between items-center mb-10"> <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Temporal Access</h3> <X onClick={() => setIsTrayOpen(false)} size={20} className="cursor-pointer opacity-40 hover:opacity-100"/> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"> {[ { label: '24H PASS', price: '$5', hours: 24, priceId: 'price_1Sqe8rGg8RUnSFObq4cv8Mnd' }, { label: '7D SPRINT', price: '$20', hours: 168, priceId: 'price_1SqeAhGg8RUnSFObRUOFFNH7' }, { label: '30D FORGE', price: '$75', hours: 720, priceId: 'price_1SqeCqGg8RUnSFObHN4ZMCqs' } ].map((pass, i) => ( <button key={i} onClick={() => handleRefuel(pass.priceId, pass.hours)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left group"> <div className="text-[9px] font-black text-zinc-500 mb-1 group-hover:text-indigo-400">{pass.label}</div> <div className="text-2xl font-black italic">{pass.price}</div> </button> ))} </div> <div className="pt-8 border-t border-white/5"> <CouncilBuilder selectedModels={selectedModels} setSelectedModels={setSelectedModels} userBalance={0} onIgnite={handleIgnition} /> </div> </div> </div> )}

      <style jsx>{` @keyframes loading { 0% { width: 0%; } 20% { width: 10%; } 100% { width: 100%; } } `}</style>
    </div>
  );
}
