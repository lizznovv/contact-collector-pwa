function formatDraftTime(ts) {
    if (!ts) return '';
    const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
    if (diff < 1)  return 'только что';
    if (diff < 60) return `${diff} мин назад`;
    return `${Math.floor(diff / 60)} ч назад`;
}

function DraftsModal({ drafts, onClose, onOpen, onDelete, onDeleteAll }) {
    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,.38)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 100,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{ background: '#fff', borderRadius: 12, width: 340, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>Черновики</span>
                    <button onClick={onClose}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
                    {drafts.length === 0 && (
                        <p style={{ fontSize: 13, color: '#888', textAlign: 'center', padding: '1rem 0' }}>
                            Нет сохранённых черновиков
                        </p>
                    )}
                    {drafts.map((d) => (
                        <div key={d.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onOpen(d)}>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{d.full_name || '(без имени)'}</div>
                                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                                    {d.company || '—'} · {formatDraftTime(d.updatedAt)}
                                </div>
                            </div>
                            <button onClick={() => onDelete(d.id)}>🗑</button>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    {drafts.length > 0 && (
                        <button onClick={onDeleteAll}>Удалить все</button>
                    )}
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
}
export default DraftsModal;