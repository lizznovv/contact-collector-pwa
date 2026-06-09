export default function LeadFormActions({
    isFormValid,
    saving,
    onCancel
}) {
    return (
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
                className="btn btn-primary"
                type="submit"
                disabled={!isFormValid || saving}
                style={{ padding: "10px 24px", cursor: "pointer" }}
            >
                {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button
                className="btn btn-secondary"
                type="button"
                onClick={onCancel}
                style={{ padding: "10px 24px", cursor: "pointer" }}
            >
                Отмена
            </button>
        </div>
    );
}