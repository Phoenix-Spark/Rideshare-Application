import { useState, useEffect } from 'react'

export default function DebugPanel() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    const debugInfo = {
        nodeEnv: import.meta.env.MODE,
        domain: import.meta.env.VITE_DOMAIN,
        port: import.meta.env.VITE_DOMAIN_PORT,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-[9999] bg-black/50 backdrop-blur-md text-white px-3 py-2 rounded-lg text-xs font-mono hover:bg-black/70 transition-all border border-white/20"
            >
                {isOpen ? '✕ Close Debug' : '🐛 Debug'}
            </button>

            {isOpen && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9998] w-96 bg-black/80 backdrop-blur-xl text-white rounded-lg shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">🐛 Debug Panel</span>
                            <span className="text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded">
                                {debugInfo.nodeEnv}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            {isMinimized ? '▼' : '▲'}
                        </button>
                    </div>

                    {!isMinimized && (
                        <div className="p-4 space-y-3 max-h-96 overflow-y-auto font-mono text-xs">
                            {/* Environment Info */}
                            <div className="space-y-1">
                                <div className="text-blue-300 font-semibold mb-2">Environment</div>
                                {Object.entries(debugInfo).map(([key, value]) => (
                                    <div key={key} className="flex justify-between gap-4 py-1 border-b border-white/5">
                                        <span className="text-white/60">{key}:</span>
                                        <span className="text-white text-right break-all">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1">
                                <div className="text-green-300 font-semibold mb-2">Network</div>
                                <div className="flex justify-between gap-4 py-1 border-b border-white/5">
                                    <span className="text-white/60">Online:</span>
                                    <span className={navigator.onLine ? 'text-green-400' : 'text-red-400'}>
                                        {navigator.onLine ? '✓ Connected' : '✗ Offline'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-purple-300 font-semibold mb-2">Performance</div>
                                <div className="flex justify-between gap-4 py-1 border-b border-white/5">
                                    <span className="text-white/60">Memory:</span>
                                    <span className="text-white">
                                        {(performance as any).memory 
                                            ? `${((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2)} MB`
                                            : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2 space-y-2">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 rounded transition-colors"
                                >
                                    🔄 Reload Page
                                </button>
                                <button
                                    onClick={() => console.clear()}
                                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded transition-colors"
                                >
                                    🗑️ Clear Console
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}