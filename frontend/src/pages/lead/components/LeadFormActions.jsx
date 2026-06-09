export default function LeadFormActions({
    isFormValid,
    saving,
    onCancel
}) {
    return (
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
                type="submit"
                disabled={!isFormValid || saving}
            >
                {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button type="button" onClick={onCancel}>
                Отмена
            </button>
        </div>
    );

}